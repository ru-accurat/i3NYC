#!/usr/bin/env python3
"""Extracts the static prose of a research applet into data/research/<slug>.content.json.

    python3 scripts/extract-research-prose.py "<applet.html>" <slug>

The companion of extract-research-data.mjs: that one pulls the data constants,
this one pulls the words (headline, findings, section intros, notes, method
caveats, footer) so the React pages stay word-for-word faithful to the source
and can be refreshed when a new export arrives.

Inline markup is reduced to a small list of segments the <Rich> component
renders: plain text, bold, and links. Nothing is passed through as HTML.
"""

import json
import os
import re
import sys
from html.parser import HTMLParser

VOID = {"br", "img", "input", "meta", "link", "hr"}


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.parent = parent
        self.children = []  # Node or str

    def cls(self):
        return (self.attrs.get("class") or "").split()

    def find_all(self, pred):
        out = []
        for c in self.children:
            if isinstance(c, Node):
                if pred(c):
                    out.append(c)
                out.extend(c.find_all(pred))
        return out

    def text(self):
        return "".join(c if isinstance(c, str) else c.text() for c in self.children)


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("root")
        self.cur = self.root
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1
            return
        if self.skip:
            return
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip = max(0, self.skip - 1)
            return
        if self.skip or tag in VOID:
            return
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        if not self.skip:
            self.cur.children.append(data)


def segments(node):
    """Inline content as [{t}|{b}|{a,href}] with whitespace collapsed."""
    out = []

    def push(kind, text, href=None):
        text = re.sub(r"\s+", " ", text)
        if not text:
            return
        if out and kind == "t" and "t" in out[-1]:
            out[-1]["t"] += text
            return
        seg = {kind: text}
        if href:
            seg["href"] = href
        out.append(seg)

    def walk(n, bold=False):
        for c in n.children:
            if isinstance(c, str):
                push("b" if bold else "t", c)
            elif c.tag == "a":
                push("a", c.text(), c.attrs.get("href"))
            elif c.tag in ("b", "strong"):
                walk(c, True)
            elif c.tag == "br":
                push("b" if bold else "t", " ")
            else:
                walk(c, bold)

    walk(node)
    if out and "t" in out[0]:
        out[0]["t"] = out[0]["t"].lstrip()
    if out and "t" in out[-1]:
        out[-1]["t"] = out[-1]["t"].rstrip()
    return [s for s in out if any(v for k, v in s.items() if k != "href")]


def plain(node):
    return re.sub(r"\s+", " ", node.text()).strip()


def has(c):
    return lambda n: c in n.cls()


def main():
    if len(sys.argv) != 3:
        sys.exit('Usage: python3 scripts/extract-research-prose.py "<applet.html>" <slug>')
    src, slug = sys.argv[1], sys.argv[2]
    tree = Tree()
    tree.feed(open(src, encoding="utf-8").read())
    root = tree.root

    def first(pred):
        found = root.find_all(pred)
        return found[0] if found else None

    header = first(lambda n: n.tag == "header")
    out = {
        "eyebrow": plain(first(has("eyebrow"))) if first(has("eyebrow")) else "",
        "title": plain(first(lambda n: n.tag == "h1")),
        "lede": segments(first(has("lede"))) if first(has("lede")) else [],
        "lenses": [
            {"key": b.attrs.get("data-k", ""), "label": plain(b)}
            for b in (header.find_all(lambda n: n.tag == "button") if header else [])
        ],
        "sections": [],
    }

    for sec in root.find_all(lambda n: n.tag == "section"):
        h2 = [c for c in sec.children if isinstance(c, Node) and c.tag == "h2"]
        if not h2:
            continue
        entry = {"id": sec.attrs.get("id", ""), "title": plain(h2[0])}
        subs = [c for c in sec.children if isinstance(c, Node) and "sub" in c.cls()]
        if subs:
            entry["sub"] = segments(subs[0])
        notes = [segments(n) for n in sec.find_all(has("note")) if not n.attrs.get("id") and plain(n)]
        if notes:
            entry["notes"] = notes
        findings = sec.find_all(has("findings"))
        if findings:
            entry["findings"] = [
                {"title": plain(li.find_all(lambda n: n.tag == "h3")[0]), "body": segments(li.find_all(lambda n: n.tag == "p")[0])}
                for li in findings[0].find_all(lambda n: n.tag == "li")
            ]
        tiles = sec.find_all(has("tile"))
        if tiles:
            entry["tiles"] = [
                {"value": plain(t.find_all(lambda n: n.tag == "b")[0]), "body": segments(t.find_all(lambda n: n.tag == "span")[0])}
                for t in tiles
            ]
        doors = [d for d in sec.find_all(has("door"))]
        if doors:
            entry["cards"] = [
                {"title": plain(d.find_all(lambda n: n.tag == "h3")[0]), "body": segments(d.find_all(lambda n: n.tag == "p")[0])}
                for d in doors
            ]
        caveats = sec.find_all(has("caveats"))
        if caveats:
            entry["caveats"] = [segments(li) for li in caveats[0].find_all(lambda n: n.tag == "li")]
        # Sub-headings with the intro paragraph that follows them, in order.
        blocks = []
        for h3 in sec.find_all(lambda n: n.tag == "h3"):
            p = h3.parent
            if "door" in p.cls() or p.tag == "li":
                continue
            block = {"title": plain(h3)}
            sibs = [c for c in p.children if isinstance(c, Node)]
            i = sibs.index(h3)
            if i + 1 < len(sibs) and "sub" in sibs[i + 1].cls():
                block["sub"] = segments(sibs[i + 1])
            ids = [c.attrs["id"] for c in sibs[i + 1 : i + 4] if c.attrs.get("id")]
            ids += [g.attrs["id"] for c in sibs[i + 1 : i + 4] for g in c.find_all(lambda n: bool(n.attrs.get("id")))]
            if ids:
                block["target"] = ids[0]
            blocks.append(block)
        if blocks:
            entry["blocks"] = blocks
        summary = sec.find_all(lambda n: n.tag == "summary")
        if summary:
            entry["summary"] = plain(summary[0])
        out["sections"].append(entry)

    footer = first(lambda n: n.tag == "footer")
    out["footer"] = segments(footer) if footer else []

    dest = os.path.join("data", "research", f"{slug}.content.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Wrote {dest}: {len(out['sections'])} sections")


if __name__ == "__main__":
    main()

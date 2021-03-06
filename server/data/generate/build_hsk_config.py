import json

out = []

def parse_line(line):
    if (line == ""):
        return
    line = line.split("/")
    segment_name = line[0].strip()
    print("Parsing " + segment_name)
    vocab = line[1].strip().split(" ")
    chars_set = set()
    chars = []

    for word in vocab:
        for char in word:
            if char not in chars_set:
                chars.append(char)
                chars_set.add(char)

    out.append({
        "title": segment_name,
        "characters": chars,
        "vocabulary": vocab
    })



def main():
    with open('hsk_vocab.txt') as file:
        text = file.read()
        lines = text.split('\n')


    for line in lines:
        parse_line(line)

    with open('../sections.json', 'w') as outfile:
        json.dump(out, outfile, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()

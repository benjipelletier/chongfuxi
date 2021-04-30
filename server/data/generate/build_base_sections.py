import json

RADICALS_FILE = '../radicals.json'
HSK_FILE = '../hsk_words.json'
OUT_FILE = '../base_sections.json'


out = []

def make_section(title, idx, words):
    return {
        'title': title,
        'id': idx,
        'words': words
    }

def main():

    with open(RADICALS_FILE) as file:
        radicals = json.load(file)

    
    with open(HSK_FILE) as file:
        hsk = json.load(file)

    out.append(make_section("Radicals", "radicals", radicals))

    for key in hsk:
        print(key + ' ' + str(len(hsk[key])))
        out.append(make_section(
            'HSK ' + key.split('_')[1],
            key,
            hsk[key]
        ))


    with open(OUT_FILE, 'w') as outfile:
        json.dump(out, outfile, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()

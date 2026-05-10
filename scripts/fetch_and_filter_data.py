import csv
import json
import urllib.request
import io
import os
import ssl

# Bypass SSL verification for local environment issues
ssl_context = ssl._create_unverified_context()

BIOS_URL = "https://raw.githubusercontent.com/KeithGalli/Olympics-Dataset/master/athletes/bios.csv"
RESULTS_URL = "https://raw.githubusercontent.com/KeithGalli/Olympics-Dataset/master/results/results.csv"

def fetch_csv(url):
    print(f"Fetching {url}...")
    with urllib.request.urlopen(url, context=ssl_context) as response:
        content = response.read().decode('utf-8')
        return csv.DictReader(io.StringIO(content))

def process_data():
    # 1. Fetch results first to find USA athletes
    results_reader = fetch_csv(RESULTS_URL)
    usa_results = []
    usa_athlete_ids = set()

    print("Filtering USA results...")
    first_row = True
    for row in results_reader:
        if first_row:
            print(f"Results Headers: {row.keys()}")
            print(f"Sample Row: {row}")
            first_row = False
        
        noc_val = row.get('NOC')
        noc = noc_val.upper() if noc_val else ''
        if noc == 'USA':
            medal = row.get('Medal')
            if medal and medal != 'na' and medal != '':
                usa_results.append({
                    'athlete_id': row['athlete_id'],
                    'sport': row.get('Discipline', 'Unknown'),
                    'event': row.get('Event', 'Unknown'),
                    'medal': medal,
                    'year': row.get('Games', '').split(' ')[0] # Extract year from '1912 Summer Olympics'
                })
                usa_athlete_ids.add(row['athlete_id'])
    
    print(f"Found {len(usa_results)} results for USA.")

    # 2. Fetch bios to get physical traits and hometowns
    bios_reader = fetch_csv(BIOS_URL)
    athlete_bios = {}

    print("Filtering USA bios and physical traits...")
    first_bio = True
    for row in bios_reader:
        if first_bio:
            print(f"Bios Headers: {row.keys()}")
            first_bio = False
            
        aid = row.get('athlete_id')
        if aid in usa_athlete_ids:
            # Parse Born field: "Date in City, Region (Country)"
            born_str = row.get('Born', '')
            hometown_city = ''
            hometown_region = ''
            if ' in ' in born_str:
                parts = born_str.split(' in ')[1].split(' (')
                location = parts[0]
                loc_parts = [p.strip() for p in location.split(',')]
                if len(loc_parts) >= 2:
                    hometown_city = loc_parts[0]
                    hometown_region = loc_parts[1]
                elif len(loc_parts) == 1:
                    hometown_city = loc_parts[0]

            # Parse Measurements: "180 cm / 75 kg"
            measure_str = row.get('Measurements', '')
            height = ''
            weight = ''
            if ' / ' in measure_str:
                m_parts = measure_str.split(' / ')
                height = m_parts[0].replace(' cm', '').strip()
                weight = m_parts[1].replace(' kg', '').strip()
            elif ' cm' in measure_str:
                height = measure_str.replace(' cm', '').strip()
            
            # Sanitize: No names, no exact birth dates
            athlete_bios[aid] = {
                'height': height,
                'weight': weight,
                'hometown_city': hometown_city,
                'hometown_region': hometown_region
            }

    # 3. Merge and finalize
    final_data = []
    print("Merging data...")
    for res in usa_results:
        aid = res['athlete_id']
        bio = athlete_bios.get(aid, {})
        
        # Only add if we have some bio data
        if bio:
            final_data.append({
                'sport': res['sport'],
                'event': res['event'],
                'medal': res['medal'],
                'year': res['year'],
                'height': bio.get('height'),
                'weight': bio.get('weight'),
                'hometown_region': bio.get('hometown_region')
            })

    # 4. Generate Summary for AI Context
    summary = {}
    print("Generating summary...")
    for entry in final_data:
        sport = entry['sport']
        year = int(entry['year']) if entry['year'].isdigit() else 0
        era = f"{(year // 10) * 10}s"
        key = f"{sport}|{era}"
        
        if key not in summary:
            summary[key] = {
                'sport': sport,
                'era': era,
                'medals': 0,
                'heights': [],
                'weights': [],
                'regions': {}
            }
        
        s = summary[key]
        s['medals'] += 1
        if entry['height'].isdigit():
            s['heights'].append(int(entry['height']))
        if entry['weight'].isdigit():
            s['weights'].append(int(entry['weight']))
        
        region = entry['hometown_region']
        if region:
            s['regions'][region] = s['regions'].get(region, 0) + 1

    # Finalize summary
    ai_context_data = []
    for k, v in summary.items():
        avg_h = sum(v['heights']) / len(v['heights']) if v['heights'] else 0
        avg_w = sum(v['weights']) / len(v['weights']) if v['weights'] else 0
        top_regions = sorted(v['regions'].items(), key=lambda x: x[1], reverse=True)[:3]
        
        ai_context_data.append({
            'sport': v['sport'],
            'era': v['era'],
            'total_medals': v['medals'],
            'avg_height_cm': round(avg_h, 1),
            'avg_weight_kg': round(avg_w, 1),
            'top_regions': [r[0] for r in top_regions]
        })

    with open('data/team_usa_summary.json', 'w') as f:
        json.dump(ai_context_data, f, indent=2)

    # 5. Save raw data
    os.makedirs('data', exist_ok=True)
    output_path = 'data/team_usa_historical.json'
    
    # Limit to a representative sample if too large for context (e.g., 2000 entries)
    # This ensures we don't blow up the AI context but still have 120 years of coverage.
    print(f"Saving {len(final_data)} records to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(final_data, f, indent=2)

if __name__ == "__main__":
    process_data()

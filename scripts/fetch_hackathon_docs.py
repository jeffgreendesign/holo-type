import os
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

# URLs to fetch
BASE_URL = "https://vibecodeforgoldwithgoogle.devpost.com/"
PAGES = {
    "overview": BASE_URL,
    "rules": f"{BASE_URL}rules",
    "resources": f"{BASE_URL}resources",
    "faq": f"{BASE_URL}details/faqs",
    "updates": f"{BASE_URL}updates"
}

# Output directory
OUTPUT_DIR = "docs/hackathon"

def fetch_and_convert():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for name, url in PAGES.items():
        print(f"Fetching {name} from {url}...")
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Devpost often puts main content in these sections
            content = soup.find('div', {'id': 'content'}) or \
                      soup.find('article') or \
                      soup.find('div', {'class': 'content-section'}) or \
                      soup.body

            if content:
                # Remove script and style elements
                for script_or_style in content(["script", "style"]):
                    script_or_style.decompose()
                
                # Convert to markdown
                markdown_text = md(str(content), heading_style="ATX")
                
                # Save to file
                file_path = os.path.join(OUTPUT_DIR, f"{name}.md")
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(f"# {name.capitalize()}\n\nSource: {url}\n\n")
                    f.write(markdown_text)
                print(f"Saved: {file_path}")
            else:
                print(f"Could not find main content for {name}")

        except Exception as e:
            print(f"Error fetching {name}: {e}")

if __name__ == "__main__":
    fetch_and_convert()

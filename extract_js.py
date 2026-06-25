import os
import re

files_to_process = ['cv.html', 'certified.html', 'portofolio.html', 'view.html']
js_dir = 'js'

if not os.path.exists(js_dir):
    os.makedirs(js_dir)

for file in files_to_process:
    if not os.path.exists(file):
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Use regex to find <script>...</script> block
    # Note: We specifically look for <script> without src attribute
    pattern = re.compile(r'<script>\s*(.*?)\s*</script>', re.DOTALL)
    match = pattern.search(content)
    
    if match:
        js_content = match.group(1)
        js_filename = file.replace('.html', '.js')
        js_filepath = os.path.join(js_dir, js_filename)
        
        with open(js_filepath, 'w', encoding='utf-8') as f:
            f.write(js_content)
            
        new_content = content[:match.start()] + f'<script src="{js_filepath}"></script>' + content[match.end():]
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Processed {file} -> {js_filepath}")
    else:
        print(f"No inline script found in {file}")

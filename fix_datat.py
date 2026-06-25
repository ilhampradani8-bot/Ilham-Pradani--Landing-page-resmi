import re

with open('include/header.html', 'r') as f:
    content = f.read()

# We need to find elements with data-t="xxx" that also contain <i data-lucide="...">
# Example: <a href="..." class="..." data-t="nav_services"><i data-lucide="..."></i> Keahlian</a>
# We want to change it to: <a href="..." class="..."><i data-lucide="..."></i> <span data-t="nav_services">Keahlian</span></a>

# Also handles: Info <i data-lucide="chevron-down" ...></i>

def replacer(match):
    full_match = match.group(0)
    # Extract data-t attribute
    data_t_match = re.search(r'data-t="([^"]+)"', full_match)
    if not data_t_match:
        return full_match
    
    data_t_val = data_t_match.group(1)
    
    # Remove data-t from the main tag
    new_tag = re.sub(r'\s*data-t="[^"]+"', '', full_match)
    
    return new_tag

# Let's just do it manually for the few cases in header.html using multi_replace_file_content or a python script that does exact string replacements.


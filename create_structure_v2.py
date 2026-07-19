import os
import re

def create_structure_from_text(text, root_dir_name):
    lines = text.strip().split('\n')
    lines = [line.rstrip() for line in lines if line.strip() and line.strip() != '│']
    
    path_stack = [(-1, root_dir_name)]
    os.makedirs(root_dir_name, exist_ok=True)
    
    for line in lines:
        line_no_comment = line.split('#')[0].rstrip()
        if not line_no_comment.strip() or line_no_comment.strip() == '│':
            continue
            
        match = re.search(r'([a-zA-Z0-9_\-\.]+)/?$', line_no_comment)
        if not match:
            continue
            
        name = match.group(1)
        is_dir = line_no_comment.endswith('/') or not ('.' in name)
        has_branch = '├──' in line_no_comment or '└──' in line_no_comment
        
        indent = line_no_comment.rfind(name)
        
        if indent == 0 and (name == 'frontend' or name == 'backend'):
            continue
            
        if has_branch:
            while len(path_stack) > 1 and path_stack[-1][0] >= indent:
                path_stack.pop()
        else:
            while len(path_stack) > 1 and path_stack[-1][0] > indent:
                path_stack.pop()
                
        parent_path = path_stack[-1][1]
        current_path = os.path.join(parent_path, name)
        
        if is_dir:
            os.makedirs(current_path, exist_ok=True)
            path_stack.append((indent, current_path))
        else:
            os.makedirs(os.path.dirname(current_path), exist_ok=True)
            open(current_path, 'a').close()

def extract_tree_block(filepath, section_title):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    idx = content.find(section_title)
    if idx == -1:
        print(f"Could not find section {section_title} in {filepath}")
        return None
        
    start_idx = content.find('```text', idx)
    if start_idx == -1:
        start_idx = content.find('```', idx)
        if start_idx == -1:
            print(f"Could not find code block in {filepath}")
            return None
            
    start_idx = content.find('\n', start_idx) + 1
    end_idx = content.find('```', start_idx)
    
    return content[start_idx:end_idx]

def main():
    base_dir = r"d:\AI _Document_Assistant\aI_document_assistant"
    
    frontend_file = os.path.join(base_dir, "05_Frontend_Architecture.md")
    backend_file = os.path.join(base_dir, "06_Backend_Architecture.md")
    
    frontend_tree = extract_tree_block(frontend_file, "# 4. Folder Structure")
    if frontend_tree:
        create_structure_from_text(frontend_tree, os.path.join(base_dir, "ai_document_assidstant_client"))
        print("Frontend structure created.")
        
    backend_tree = extract_tree_block(backend_file, "# 5. Project Structure")
    if backend_tree:
        create_structure_from_text(backend_tree, os.path.join(base_dir, "ai_document_assidstant_server"))
        print("Backend structure created.")

if __name__ == "__main__":
    main()

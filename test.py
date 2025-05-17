import requests
import json
import os

API_KEY = 'AIzaSyAMlAqBugYtD27o8QmGHZ1iJHdQQ9ZIZhU'
FOLDER_ID = '1sAveJQbFUdIVfSZe_fJt5nKnChMysDSp'  # Replace with your public folder ID

def get_file_link(file_id, mime_type):
    """Generate a direct link to a Google Drive file based on its ID and MIME type."""
    if "folder" in mime_type:
        return f"https://drive.google.com/drive/folders/{file_id}"
    else:
        return f"https://drive.google.com/file/d/{file_id}/view?usp=drive_link"

def get_file_icon(mime_type, name):
    """Determine the appropriate Font Awesome icon class based on MIME type and filename."""
    if "folder" in mime_type:
        return "fas fa-folder"

    # Check file extension
    _, ext = os.path.splitext(name.lower())

    if ext in ['.pdf']:
        return "fas fa-file-pdf"
    elif ext in ['.doc', '.docx']:
        return "fas fa-file-word"
    elif ext in ['.xls', '.xlsx']:
        return "fas fa-file-excel"
    elif ext in ['.ppt', '.pptx']:
        return "fas fa-file-powerpoint"
    elif ext in ['.jpg', '.jpeg', '.png', '.gif']:
        return "fas fa-file-image"
    elif ext in ['.zip', '.rar', '.7z']:
        return "fas fa-file-archive"
    elif ext in ['.c', '.h']:
        return "fa-solid fa-c"
    elif ext in ['.java']:
        return "fab fa-java"
    elif ext in ['.py']:
        return "fab fa-python"
    elif ext in ['.js']:
        return "fab fa-js"
    elif ext in ['.html', '.htm']:
        return "fab fa-html5"
    elif ext in ['.css']:
        return "fab fa-css3-alt"
    else:
        return "fas fa-file"

def list_folder_contents(folder_id):
    url = f"https://www.googleapis.com/drive/v3/files"
    params = {
        "q": f"'{folder_id}' in parents and trashed = false",
        "key": API_KEY,
        "fields": "files(id, name, mimeType)",
        "pageSize": 1000  # Increase page size to get more files
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code}, {response.text}")
        return []

    return response.json().get("files", [])

def process_folder(folder_id, folder_name=None, depth=0, max_depth=3):
    """
    Recursively process a folder and its contents up to a maximum depth.
    Returns a list of files and folders in the folder.
    """
    if depth > max_depth:
        print(f"⚠️ Maximum depth reached for folder: {folder_name}")
        return []

    contents = list_folder_contents(folder_id)
    processed_items = []

    for item in contents:
        # Process this item
        processed_item = {
            "name": item["name"],
            "id": item["id"],
            "mimeType": item["mimeType"],
            "link": get_file_link(item["id"], item["mimeType"]),
            "icon": get_file_icon(item["mimeType"], item["name"])
        }

        # If it's a folder, recursively process its contents
        if item["mimeType"] == "application/vnd.google-apps.folder":
            subfiles = process_folder(item["id"], item["name"], depth + 1, max_depth)
            processed_item["files"] = subfiles

        processed_items.append(processed_item)

    return processed_items

def build_structure(folder_id):
    """
    Build a structure of the Google Drive folder and its contents.
    Returns a list of top-level folders with their files and subfolders.
    """
    contents = list_folder_contents(folder_id)
    structure = []

    for item in contents:
        if item["mimeType"] == "application/vnd.google-apps.folder":
            # Process this folder and its contents
            folder_contents = process_folder(item["id"], item["name"])

            # Separate files and folders
            files = []
            subfolders = []

            for content in folder_contents:
                if content["mimeType"] == "application/vnd.google-apps.folder":
                    subfolders.append(content)
                else:
                    files.append(content)

            # Create the folder structure
            folder_structure = {
                "subject": item["name"],
                "id": item["id"],
                "link": get_file_link(item["id"], item["mimeType"]),
                "files": files,
                "subfolders": subfolders
            }

            structure.append(folder_structure)

    return structure

structure = build_structure(FOLDER_ID)

with open("js/GEC_2st_Year.json", "w", encoding="utf-8") as f:
    json.dump(structure, f, indent=2, ensure_ascii=False)

print("✅ Saved as js/IDSD_1st_Year.json")

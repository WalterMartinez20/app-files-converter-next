import sys
import PyPDF2

def process_pdf(action, input_path, output_path, password):
    if action == "protect":
        reader = PyPDF2.PdfReader(input_path)
        writer = PyPDF2.PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        writer.encrypt(password)
        with open(output_path, "wb") as f:
            writer.write(f)
            
    elif action == "unlock":
        reader = PyPDF2.PdfReader(input_path)
        if reader.is_encrypted:
            success = reader.decrypt(password)
            if not success:
                print("Incorrect password")
                sys.exit(1)
                
        writer = PyPDF2.PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
            
        with open(output_path, "wb") as f:
            writer.write(f)
            
    else:
        print(f"Unknown action: {action}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python pdf_crypto.py <protect|unlock> <input_path> <output_path> <password>")
        sys.exit(1)
        
    action = sys.argv[1]
    input_path = sys.argv[2]
    output_path = sys.argv[3]
    password = sys.argv[4]
    
    try:
        process_pdf(action, input_path, output_path, password)
        print("SUCCESS")
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

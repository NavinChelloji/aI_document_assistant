from langchain_text_splitters import RecursiveCharacterTextSplitter

def get_text_splitter():
    """
    Returns a RecursiveCharacterTextSplitter configured for standard document chunking.
    """
    return RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        is_separator_regex=False,
    )

def chunk_text(text: str) -> list[str]:
    splitter = get_text_splitter()
    return splitter.split_text(text)

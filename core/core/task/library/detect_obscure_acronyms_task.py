from core.converters.input.naut_parser import NautDoc, NautToken

known_acronyms = [
    "ML",
    "GPU",
    "NLP",
    "CRUD",
    "STEM",
    "UI/UX",
    "REST",
    "API",
    "GCP",
    "QA",
    "AWS",
    "SEO",
]


# Obscure Acronyms
# HSTS, MJML, PACS, DICOM


def detect_obscure_acronyms_task(naut_doc: NautDoc) -> list[NautToken]:
    obscure_acronyms = []

    for sentence in naut_doc.sentences:
        for token in sentence.tokens:
            isAcronym = token.text.isupper()
            if isAcronym and token.text not in known_acronyms:
                obscure_acronyms.append(token)

    return obscure_acronyms

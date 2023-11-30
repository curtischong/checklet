getParseStrategy = (file: any) => {
    if (file.type === "application/pdf") {
        return async (content: any) => {
            const doc = pdfjs.getDocument({ data: content });
            return await doc.promise.then((pdf: any) => {
                const maxPages = pdf._pdfInfo.numPages;
                const countPromises: Promise<any>[] = [];
                for (let i = 1; i <= maxPages; ++i) {
                    const page = pdf.getPage(i);
                    countPromises.push(
                        page.then((p: any) => {
                            const textContent = p.getTextContent();
                            return textContent.then((text: any) => {
                                let result = "";
                                let lastY = text.items[0] ?? -1;
                                text.items.forEach(
                                    (item: any, itemIndex: any) => {
                                        if (item.transform[5] != lastY) {
                                            result += "\n";
                                            lastY = item.transform[5];
                                        }
                                        result += item.str;
                                    },
                                );
                                return result;
                            });
                        }),
                    );
                }
                return Promise.all(countPromises).then((texts) => {
                    const result = texts.join("");
                    return result;
                });
            });
        };
    }

    return async (content: any) => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);
        return doc.getFullText();
    };
};

const path = require("path");

class Print {
    constructor() {
        this.option =  {
            silent: true,
            printBackground: false,
            color: false,
            margin: {
                marginType: 'custom',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
            },
            pageSize: 'A5',
            landscape: false,
            pagesPerSheet: 1,
            collate: false,
            copies: 1,
        }
        this.struck = (printWindow, html, content) => {
            const options = this.option
            return new Promise((resolve, reject) => {
                printWindow.loadFile(html, {
                    query: {queryKey: JSON.stringify(content)},
                    hash: "hashValue",
                });

                setTimeout(() => {
                    printWindow.webContents.print(options, (success, failureReason) => {
                        console.log(success);
                        console.log(failureReason);
                        if (!success) {
                            console.log('Print failled');
                            console.log(failureReason);
                        } else {
                            if (printWindow) {
                                // setTimeout(()=> {
                                //     this.win.close();
                                // }, 200)
                            }
                            console.log('Print success');

                        }
                        resolve()
                    });
                }, 300)
            })
        }
    }
}


module.exports = {
    Print: new Print()
}


export type Parameter = {
    name: string;
    range: number;
    bits?: number;
    logScaling?: {
        decades: number;
        base: number;
    },
    gain?: number;
    label?: string;
}

export class FCSWriter {
    private parameters: Parameter[] = [];
    private headerSegment = new Uint8Array(58);
    private textSegment: Uint8Array;
    private dataSegment: Uint8Array;
    private dataLength: number;
    private _tempTextSegmentLength: number;

    setParameters (parameters: Parameter[]) {
        this.parameters = parameters;
    }

    getParameters () {
        return this.parameters;
    }

    build (data: Float32Array, parameters?: Parameter[]) {
        if (parameters) {
            this.setParameters(parameters);
        }

        if (data.length % this.parameters.length !== 0) {
            throw new Error('Data length must be divisible by number of parameters');
        }

        this.dataLength = data.length / this.parameters.length;

        this.buildTextSegment();
        this.buildDataSegment(data);
        this.buildHeaderSegment();
        this.buildTextSegment();

        const fullContent = new Uint8Array(
            this.headerSegment.length
            + this.textSegment.length
            + this.dataSegment.length
        );

        fullContent.set(this.headerSegment, 0);
        fullContent.set(this.textSegment, this.headerSegment.length);
        fullContent.set(this.dataSegment, this.headerSegment.length + this.textSegment.length);

        return fullContent;
    }

    download (filename: string, data: Float32Array, parameters?: Parameter[]) {
        const content = this.build(data, parameters);

        const blob = new Blob([content], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `${filename}.fcs`;
        a.click();

        URL.revokeObjectURL(url);
    }

    private buildTextSegment () {
        const textStart = 58;
        const textEnd = textStart + this.textSegment?.length - 1;
        const dataStart = textEnd + 1;
        const dataEnd = dataStart + this.dataSegment?.length - 1;

        const textFields = [
            '$BEGINANALYSIS', '0',
            '$BEGINDATA', this.textSegment ? dataStart.toString() : '0',
            '$BEGINSTEXT', '0',
            '$BYTEORD', '1,2,3,4',
            '$DATATYPE', 'F',
            '$ENDANALYSIS', '0',
            '$ENDDATA', this.textSegment ? dataEnd.toString() : '0',
            '$ENDSTEXT', '0',
            '$MODE', 'L',
            '$NEXTDATA', '0',
            '$PAR', this.parameters.length.toString(),
            '$TOT', this.dataLength.toString()
        ];

        this.parameters.forEach ((parameter, index) => {
            textFields.push(`$P${index + 1}N`);
            textFields.push(parameter.name);

            textFields.push(`$P${index + 1}R`);
            textFields.push(parameter.range.toString());

            textFields.push(`$P${index + 1}B`);
            textFields.push((parameter.bits || 32).toString());

            textFields.push(`$P${index + 1}E`);

            if (parameter.logScaling && parameter.logScaling.decades) {
                textFields.push(`${parameter.logScaling.decades.toString()},${parameter.logScaling.base.toString()}`);
            }
            else {
                textFields.push('0,0');
            }

            if (parameter.gain) {
                textFields.push(`$P${index + 1}G`);
                textFields.push(parameter.gain.toString());
            }
        });

        let content = '|';
        for (let i = 0; i < textFields.length; i += 2) {
            content += `${textFields[i]}|${textFields[i + 1]}|`;
        }

        if (!this.textSegment) {
            content += ' '.repeat(50);
            this._tempTextSegmentLength = content.length;
        }
        else {
            content += ' '.repeat(this._tempTextSegmentLength - content.length);
        }

        this.textSegment = new TextEncoder().encode(content);
    }

    private buildDataSegment (data: Float32Array) {
        const buffer = new ArrayBuffer(data.length * 4);
        const view = new DataView(buffer);

        for (let i = 0; i < data.length; i++) {
            view.setFloat32(i * 4, data[i], true);
        }

        this.dataSegment = new Uint8Array(buffer);
    }

    private buildHeaderSegment () {
        const textStart = 58;
        const textEnd = textStart + this.textSegment.length - 1;
        const dataStart = textEnd + 1;
        const dataEnd = dataStart + this.dataSegment.length - 1;

        const headerContent = new TextEncoder().encode(
            'FCS3.1'
            + ' '.repeat(4)
            + textStart.toString().padStart(8, ' ')
            + textEnd.toString().padStart(8, ' ')
            + dataStart.toString().padStart(8, ' ')
            + dataEnd.toString().padStart(8, ' ')
            + '0'.padStart(8, ' ')
            + '0'.padStart(8, ' ')
        );

        if (headerContent.length !== 58) {
            throw new Error('Header must be exactly 58 bytes');
        }

        this.headerSegment.set(headerContent);
    }
}

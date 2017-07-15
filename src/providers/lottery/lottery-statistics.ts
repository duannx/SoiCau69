import { ResponseCode } from '../app-constant';

export class LotteryStatistics {
    mDate: Date;
    mDateStr: string;
    nhieunhat: Array<Loto> = [];
    itnhat: Array<Loto> = [];
    dauloto: Array<Loto> = [];
    duoiloto: Array<Loto> = [];
    logan: Array<Loto> = [];

    onResponseLotteryStatistics(data) {
        this.clearLotteryStatistics();
        if (data['status'] == ResponseCode.SUCCESS) {
            if (data['content'].length > 0) {
                let loto40days = data['content'];
                let lotodau: Array<Loto> = [];
                let lotoduoi: Array<Loto> = [];
                let tempLoto: Loto = new Loto();
                {
                    for (let i = 0; i < 10; i++) {
                        let loto = new Loto();
                        loto.setValue(0, i);
                        lotodau.push(loto);
                    }
                    for (let i = 0; i < 10; i++) {
                        let loto = new Loto();
                        loto.setValue(0, i);
                        lotoduoi.push(loto);
                    }
                }

                for (let i = 0; i < 10; i++) {
                    let loto = new Loto();
                    loto.setValue(loto40days[i].n, loto40days[i].l);
                    this.nhieunhat.push(loto);

                    tempLoto = lotodau[Math.floor(loto40days[i].l / 10)];
                    lotodau[Math.floor(loto40days[i].l / 10)].setFrequency(tempLoto.frequency + loto40days[i].n);
                    tempLoto = lotoduoi[loto40days[i].l % 10];
                    lotoduoi[loto40days[i].l % 10].setFrequency(tempLoto.frequency + loto40days[i].n);
                }
                for (let i = 10; i < 90; i++) {
                    tempLoto = lotodau[Math.floor(loto40days[i].l / 10)];
                    lotodau[Math.floor(loto40days[i].l / 10)].setFrequency(tempLoto.frequency + loto40days[i].n);
                    tempLoto = lotoduoi[loto40days[i].l % 10];
                    lotoduoi[loto40days[i].l % 10].setFrequency(tempLoto.frequency + loto40days[i].n);
                }
                for (let i = 99; i > 89; i--) {
                    let loto = new Loto();
                    loto.setValue(loto40days[i].n, loto40days[i].l);
                    this.itnhat.push(loto);

                    tempLoto = lotodau[Math.floor(loto40days[i].l / 10)];
                    lotodau[Math.floor(loto40days[i].l / 10)].setFrequency(tempLoto.frequency + loto40days[i].n);
                    tempLoto = lotoduoi[loto40days[i].l % 10];
                    lotoduoi[loto40days[i].l % 10].setFrequency(tempLoto.frequency + loto40days[i].n);
                }

                for (let i = 0; i < lotodau.length - 1; i++) {
                    for (let j = i + 1; j < lotodau.length; j++) {
                        if (lotodau[i].frequency < lotodau[j].frequency) {
                            let temp = lotodau[i];
                            lotodau[i] = lotodau[j];
                            lotodau[j] = temp;
                        }
                        if (lotoduoi[i].frequency < lotoduoi[j].frequency) {
                            let temp = lotoduoi[i];
                            lotoduoi[i] = lotoduoi[j];
                            lotoduoi[j] = temp;
                        }
                    }
                }

                this.dauloto = lotodau;
                this.duoiloto = lotoduoi;
            }
        }
    }

    onRequestLotteryLoganNow(data) {
        this.clearLogan();
        if (data['status'] == ResponseCode.SUCCESS) {
            if (data['content'].length > 0) {
                let logan = data['content'];
                logan.forEach(element => {
                    let loto = new Loto();
                    loto.setValue(element.amount, element.code);
                    this.logan.push(loto);
                });
            }
        }
    }

    clearLotteryStatistics() {
        this.nhieunhat = [];
        this.itnhat = [];
        this.dauloto = [];
        this.duoiloto = [];
    }

    clearLogan() {
        this.logan = [];
    }
}

export class Loto {
    code: number;
    loto: string;
    frequency: number;
    constructor() {
        this.createDefault();
    }
    createDefault() {
        this.code = -1;
        this.loto = '--';
        this.frequency = 0;
    }
    setValue(frequency: number, code: number) {
        this.code = code;
        this.frequency = frequency;
        this.loto = "" + code;
    }
    setFrequency(frequency: number) {
        this.frequency = frequency;
    }
}
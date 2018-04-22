//戰鬥設定
/// <reference path=".\typings\globals\pixi.js\index.d.ts" />
"use strict";
exports: {
    this.readFile = function(file_path) {
        let data = fs.readFileSync(file_path, 'utf8');
        data = JSON.parse(data);
        return data;
    };
    this.Convolution = function(input_X = [0], input_H = [0]) {
        input_X = input_X || [0];
        input_H = input_H || [0];
        let output_Y = [];
        for (let n = 0; n < (input_X.length + input_H.length - 1); n++) {
            output_Y[n] = 0;
            for (let k = 0; k < (input_X.length + input_H.length - 1); k++) {
                if (input_X[k] != undefined && input_H[n - k] != undefined) {
                    output_Y[n] += input_X[k] * input_H[n - k];
                }
            }
        }
        return output_Y;
    };
    this.printFile = function(AnswerData) {
        if (!fs.existsSync("./resources/app/printFile")) {
            fs.mkdirSync("./resources/app/printFile", "0777");
        };
        if (!fs.existsSync("./resources/app/printFile/ConvolutionAnswer.json")) {
            fs.writeFile("./resources/app/printFile/ConvolutionAnswer.json", JSON.stringify(AnswerData), (err) => {
                if (err) throw err;
                console.log('It\'s saved!');
                alert('It\'s saved!');
            });
        } else {
            for (let i = 1;; i++) {
                if (!fs.existsSync(`./resources/app/printFile/ConvolutionAnswer(${i}).json`)) {
                    fs.writeFile(`./resources/app/printFile/ConvolutionAnswer(${i}).json`, JSON.stringify(AnswerData), (err) => {
                        if (err) throw err;
                        console.log('It\'s saved!');
                        alert('It\'s saved!');
                    });
                    break;
                };
            };
        };
    };
    /*
     *width_rate:0~1=0~100%，不設上限
     *
     */
    this.viewData = function(data = [0], width = 800, height = 600, width_rate = 1, id = null, colorset = { background: 0x000000, X_axis: 0xff0040, Y_axis: 0xff0040, dataBar: 0x00fff2, mark: 0xff4444 }) {
        data = data || [0];
        if (colorset.background === undefined) {
            colorset.background = 0x000000;
        };
        if (colorset.X_axis === undefined) {
            colorset.X_axis = 0xff0040;
        };
        if (colorset.Y_axis === undefined) {
            colorset.Y_axis = 0xff0040;
        };
        if (colorset.dataBar === undefined) {
            colorset.dataBar = 0x00fff2;
        };
        if (colorset.mark === undefined) {
            colorset.mark = 0xff4444;
        };
        let maxdata;
        let mindata;
        let height_rate;
        let data_root;
        let renderer = new PIXI.Application(width, height, { backgroundColor: colorset.background } /*, { transparent: true }*/ ); //設置渲染器
        let stage = new PIXI.Container(); //設置容器
        let style = new PIXI.TextStyle({
            fontFamily: 'Source code pro',
            fontSize: 20,
            fill: [0xffffff]
        });
        let N_Value = new PIXI.Text("", style);

        this.readData = function() {
            return data;
        }

        this.setView = function(__data = [0], __width = 800, __height = 600, __width_rate = 1, __id = null, __colorset = { background: 0x000000, X_axis: 0xff0040, Y_axis: 0xff0040, dataBar: 0x00fff2, mark: 0xff4444 }) {
            stage.removeChildren();
            renderer.stage.removeChildren();
            data = __data || [0];
            width = __width;
            height = __height;
            width_rate = __width_rate;
            id = __id;
            if (__colorset.background === undefined) {
                __colorset.background = colorset.background;
            };
            if (__colorset.X_axis === undefined) {
                __colorset.X_axis = colorset.X_axis;
            };
            if (__colorset.Y_axis === undefined) {
                __colorset.Y_axis = colorset.Y_axis;
            };
            if (__colorset.dataBar === undefined) {
                __colorset.dataBar = colorset.dataBar;
            };
            if (__colorset.mark === undefined) {
                __colorset.mark = colorset.mark;
            };
            colorset = __colorset;
            console.log(data)
            maxdata = data[0];
            mindata = data[0];
            renderer.renderer.resize(width, height);
            renderer.renderer.backgroundColor = colorset.background;
            for (let i = 1; i < data.length; i++) {
                if (maxdata < data[i]) {
                    maxdata = data[i];
                };
                if (mindata > data[i]) {
                    mindata = data[i];
                };
            };

            if (maxdata * mindata <= 0) {
                height_rate = maxdata - mindata;
                data_root = (maxdata / height_rate) * height;
            } else if (maxdata < 0) {
                height_rate = -1 * mindata;
                data_root = 0;
            } else {
                height_rate = maxdata;
                data_root = height;
            };

            if (id == null) {
                document.body.appendChild(renderer.renderer.view);
            } else {
                document.getElementById(id).appendChild(renderer.renderer.view);
            };

            renderer.stage.addChild(stage);

            style.fill = 0xffffff - colorset.background;

            let X_axis = new PIXI.Graphics();
            renderer.stage.addChild(X_axis); // 要將 Graphics 物件加到 Stage 中
            X_axis.beginFill(colorset.X_axis); // 設定我們要畫的顏色
            X_axis.drawRect(0, data_root - 1, width, 2);

            let Y_axis = new PIXI.Graphics();
            stage.addChild(Y_axis); // 要將 Graphics 物件加到 Stage 中
            Y_axis.beginFill(colorset.Y_axis); // 設定我們要畫的顏色
            Y_axis.drawRect((width / 200) * width_rate - 1, height, 2, -1 * height);

            let dataBar = [];
            for (let i = 0; i < data.length; i++) {
                dataBar[i] = new PIXI.Graphics();
                stage.addChild(dataBar[i]); // 要將 Graphics 物件加到 Stage 中
                dataBar[i].beginFill(colorset.dataBar); // 設定我們要畫的顏色
                if (data[i] > 0) {
                    dataBar[i].drawRect((width / 100) * i * width_rate * 5, data_root - (height * data[i] / height_rate), (width / 100) * width_rate, height * data[i] / height_rate);
                } else {
                    dataBar[i].drawRect((width / 100) * i * width_rate * 5, data_root, (width / 100) * width_rate, -1 * height * data[i] / height_rate);
                }
                dataBar[i].interactive = true;
                dataBar[i].buttonMode = true;
                dataBar[i].on("pointerover", function() {
                    dataBar[i].alpha = 0.4;
                    dataBar[i].on("pointermove", function() {
                        N_Value.text = `[${i}]=${data[i]}`;
                        if (width - event.offsetX > 80) {
                            N_Value.x = event.offsetX + 10;
                        } else {
                            N_Value.x = event.offsetX - 80;
                        }
                        if (height - event.offsetY > 40) {
                            N_Value.y = event.offsetY + 20;
                        } else {
                            N_Value.y = event.offsetY - 20;
                        }
                        renderer.stage.addChild(N_Value);
                    })
                })
                dataBar[i].on("pointerout", function() {
                    dataBar[i].alpha = 1;
                    dataBar[i].off("pointermove");
                    renderer.stage.removeChild(N_Value);
                })
            };
        };

        this.setView(data, width, height, width_rate, id, colorset);

        let mark = new PIXI.Graphics();
        stage.addChild(mark); // 要將 Graphics 物件加到 Stage 中
        let mark_data = [];
        let add_Markdata = function(n) {
            for (let i = 0; i < mark_data.length; i++) {
                if (mark_data[i] == n) {
                    return;
                };
            };
            mark_data[mark_data.length] = n;
        };
        let set_Mark = function() {
            stage.removeChild(mark);
            mark = new PIXI.Graphics();
            for (let i = 0; i < mark_data.length; i++) {
                if (data.length <= mark_data[i]) {
                    for (let j = data.length; j <= mark_data[i]; j++) {
                        data[j] = 0;
                    };
                };
                mark.beginFill(colorset.mark); // 設定我們要畫的顏色
                mark.drawRect((width / 100) * mark_data[i] * width_rate * 5, data_root, (width / 100) * width_rate, -1 * height * data[mark_data[i]] / height_rate);
            };
            stage.addChild(mark);
        };
        let reset_Mark = this.reset_Mark = function() {
            mark_data = null;
            mark_data = [];
            stage.removeChild(mark);
            mark = new PIXI.Graphics();
            stage.addChild(mark);
        };
        this.markSelect = function(x1, x2) {
            x1 = Number(x1) || 0;
            x2 = Number(x2) || 0;
            if (x1 == null) {
                x1 = 0;
            };
            if (x2 == null) {
                x2 = x1;
            };
            if (x1 > x2) {
                let temp = x1;
                x1 = x2;
                x2 = temp;
            };
            console.log(x1);
            console.log(x2);
            for (let i = x1; i <= x2; i++) {
                add_Markdata(i);
                console.log(i);
            };
            set_Mark();

            /*if (n < data.length) {
                stage.removeChild(mark);
                mark = new PIXI.Graphics();
                mark.beginFill(colorset.mark); // 設定我們要畫的顏色
                mark.drawRect((width / 100) * n * width_rate * 5, data_root, (width / 100) * width_rate, -1 * height * data[n] / height_rate);
                stage.addChild(mark);
                return n;
            } else {
                for (let i = data.length; i <= n; i++) {
                    data[i] = 0;
                };
                stage.removeChild(mark);
                mark = new PIXI.Graphics();
                stage.addChild(mark);
                return 0;
            };*/
        };

        this.searchValue = function(value) {
            if (value == null) {
                value = 0;
            };
            for (let i = 0; i < data.length; i++) {
                if (value == data[i]) {
                    add_Markdata(i);
                };
            };
            set_Mark();

            /*stage.removeChild(mark);
            mark = new PIXI.Graphics();
            for (let i = 0; i < data.length; i++) {
                if (value == data[i]) {
                    mark.beginFill(colorset.mark); // 設定我們要畫的顏色
                    mark.drawRect((width / 100) * i * width_rate * 5, data_root, (width / 100) * width_rate, -1 * height * data[i] / height_rate);
                };
            };
            stage.addChild(mark);*/
        };

        this.changeValue = function(value = 0) {
            value = Number(value) || 0;
            for (let i = 0; i < mark_data.length; i++) {
                data[mark_data[i]] += value;
            };
            this.setView(data, width, height, width_rate, id, colorset);
            set_Mark();
            /*x1 = Number(x1) || 0;
            x2 = Number(x2) || 0;
            value = Number(value) || 0;
            if (x1 > x2) {
                let x3 = x2;
                x2 = x1;
                x1 = x3;
            };
            for (let i = 0; i < data.length; i++) {
                if (i >= x1 && i <= x2) {
                    data[i] += value;
                };
            };
            this.setView(data, width, height, width_rate, id, colorset);
            stage.removeChild(mark);
            mark = new PIXI.Graphics();
            for (let i = 0; i < data.length; i++) {
                if (i >= x1 && i <= x2) {
                    mark.beginFill(colorset.mark); // 設定我們要畫的顏色
                    mark.drawRect((width / 100) * i * width_rate * 5, data_root, (width / 100) * width_rate, -1 * height * data[i] / height_rate);
                };
            };
            stage.addChild(mark);*/
        };

        this.viewShift = function(x) {
            stage.x -= x;
            return stage.x;
        };

        this.enlarge = function(enlarge_rate) {
            stage.width *= enlarge_rate;
        };

        this.saveView = function() {
            if (!fs.existsSync("./resources/app/printFile")) {
                fs.mkdirSync("./resources/app/printFile", "0777");
            };
            renderer.renderer.render(stage);
            renderer.renderer.render(renderer.stage);
            if (!fs.existsSync("./resources/app/printFile/ConvolutionView.png")) {
                fs.writeFile(`./resources/app/printFile/ConvolutionView.png`, new Buffer(renderer.renderer.view.toDataURL().replace(/^[^,]+,/, ""), "base64"), function(err) {
                    if (err) {
                        console.log(err);
                        alert(err);
                    } else {
                        console.log('It\'s saved!');
                        alert('It\'s saved!');
                    };
                });
            } else {
                for (let i = 1;; i++) {
                    if (!fs.existsSync(`./resources/app/printFile/ConvolutionView(${i}).png`)) {
                        fs.writeFile(`./resources/app/printFile/ConvolutionView(${i}).png`, new Buffer(renderer.renderer.view.toDataURL().replace(/^[^,]+,/, ""), "base64"), function(err) {
                            if (err) {
                                console.log(err);
                                alert(err);
                            } else {
                                console.log('It\'s saved!');
                                alert('It\'s saved!');
                            };
                        });
                        break;
                    };
                };
            };
        };
    };
};
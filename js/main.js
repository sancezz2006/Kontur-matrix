/**
 * Created by User on 09.10.2016.
 */
"use strict";

(function(){

    //установим псевдо константы
    var MAXMATRIXSIZE = 10,
        MINMATRIXSIZE = 2,
        ERRORMATRIXEQUALITY = "Такие матрицы нельзя перемножить, так как количество столбцов матрицы А не равно количеству строк матрицы Б",
        ERRORMATRIXEMPTY = "Не все значения в матрицах заполнены",
        ERRORMATRIXTYPE = "Должны быть введены числа",
        ERRORMATRIXSIZE = "Матрица не может быть меньше 2 и больше 10";

    //Установим начальные размеры матрицы
        var matrixRowA = 2,
            matrixColA = 2,
            matrixRowB = 2,
            matrixColB = 2,
            a = setSizeMatrix(matrixRowA,matrixColA),
            b = setSizeMatrix(matrixRowB,matrixColB);


    //укоротим выражения получения документа
    function getElemById(tag){ return document.getElementById(tag); }

    //получим ID, нужных HTML элементов
    var btnMultiplyMatrix = getElemById("btn-multiply-matrix"),
        increaseRow = getElemById("btn-increase-row"),
        decreaseRow = getElemById("btn-decrease-row"),
        increaseCol = getElemById("btn-increase-col"),
        decreaseCol = getElemById("btn-decrease-col"),
        getMatrixA = getElemById('matrix-a'),
        getMatrixB = getElemById('matrix-b'),
        matrixResult = getElemById('matrix-result'),
        clearMatrix = getElemById('btn-clear-matrix'),
        changeMatrix = getElemById('btn-change-matrix'),
        matrixSettingsPanel = getElemById('matrix-settings'),
        matrixPreviewPanel = getElemById('matrix-preview');

    //отслеживаем нажатия на INPUT и меняем фон
    matrixPreviewPanel.addEventListener('focusin', function(event){
        if(event.target.nodeName == "INPUT"){
            matrixSettingsPanel.classList.add('matrix-settings-change');
        }
    });
    matrixPreviewPanel.addEventListener('focusout', function(event){
        if(event.target.nodeName == "INPUT"){
            matrixSettingsPanel.classList.remove('matrix-settings-change');
        }
    });

    //проверяем значение radiobutton
    function radioMatrixChecked(){
        var whoChecked = document.getElementsByName("RadioOptions");

        if(whoChecked[0].checked){
            return "matrixA";
        }
        if(whoChecked[1].checked){
            return "matrixB";
        }
    }

    /**
     * При добавлении\удалении полей\строк проверям переменную здесь
     * она не должна выходить за допустимые пределы.
     * @param variable  (переменная над которой совершаем действие)
     * @param operation (+\- задаём операцию над переменной)
     * @returns {*}
     */
    function matrixSizeLimit(variable,operation){
        if ((operation == "+") && (variable < MAXMATRIXSIZE)){
            variable++;
            defaultBackground();
            return variable;
        }
        else if ((operation == "-") && (variable > MINMATRIXSIZE)){
            variable--;
            defaultBackground();
            return variable;
        }
        else{
            warningMessage(ERRORMATRIXSIZE);
            return variable;
        }
    }

    /**
     * Помещаем в эту функцию переменную с текстом ошибки для вывода на панель.
     * @param message
     */
    function warningMessage(message){
        var warnMessageHtml = getElemById("warning-message");
        warnMessageHtml.innerHTML = message;
        matrixSettingsPanel.classList.add('matrix-settings-warning');
    }


    //проверка на число
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }


    //устанавливаем стандартный фон и убираем warningMessage
    function defaultBackground(){
        matrixSettingsPanel.classList.remove('matrix-settings-change');
        matrixSettingsPanel.classList.remove('matrix-settings-warning');
        var warnMessageHtml = getElemById("warning-message");
        warnMessageHtml.innerHTML = "";
    }

    //Дейстия над матрицами

    /**
     * Создаём пустой двумерный массив с заданным размером
     * @param rows (строки)
     * @param cols (колонки)
     * @returns {Array}
     */
    function setSizeMatrix(rows,cols){
        var matrix = [];

        for(var i = 0; i < cols; i++){
            matrix[i] = [];
            for(var j = 0; j < rows; j++){
                matrix[i][j] = [];
            }
        }
        return matrix;
    }


    /**
     * Отрисовывает исходные матрицы. A,B.
     * @param matrix {Array} Двумерный массив с данными
     * @param element {String} Передаем id таблицы, куда поместим матрицу.
     */
    function renderMatrix(matrix,element){
        if (Array.isArray(matrix)!=true){
            console.log('renderMatrix fail - argument is not array');
            return false;
        }

        var colsMatrix = matrix.length,
            rowsMatrix = matrix[0].length,
            html = '',
            placeholderRow = 1;

        for (var row = 0; row < rowsMatrix; row++){
            var placeholderCol = 1;

            html += '<tr>';
            for (var col = 0; col < colsMatrix; col++){
                var placeholder = placeholderRow +','+ placeholderCol;
                html += '<td>' + '<input type="text" id="matrix-input" onfocus="" onblur="" class="matrix-input" placeholder="'+ placeholder +'" value="'+ matrix[col][row] +'"></td>';
                placeholderCol++;
            }
            html += '</tr>';
            placeholderRow++;
        }
        document.getElementById(element).innerHTML = html;
    }

    /**
     * Перемножает заданные матрицы
     * @param matrixA {Array} Матрица А
     * @param matrixB {Array} Матрица B
     * @returns (Передаёт массив в функцию renderResultMatrix для отрисовки)
     */
    function MultiplyMatrix(matrixA,matrixB){

        if ((Array.isArray(matrixA)!=true) || (Array.isArray(matrixB)!=true)){
            warningMessage(ERRORMATRIXTYPE);
            return false;
        }

        var rowsMatrixA = matrixA.length, colsMatrixA = matrixA[0].length,
            rowsMatrixB = matrixB.length, colsMatrixB = matrixB[0].length,
            resultMatrix = [];

        if ((rowsMatrixA != colsMatrixB) || (colsMatrixA != rowsMatrixB)) {
            warningMessage(ERRORMATRIXEQUALITY);
            return false;
        }
        for (var i = 0; i < rowsMatrixA; i++) {resultMatrix[i] = []}
        for (var k = 0; k < colsMatrixB; k++){
            for (var i = 0; i < rowsMatrixA; i++){
                var temp = 0;
                for (var j = 0; j < rowsMatrixB; j++) {temp += matrixA[i][j]*matrixB[j][k]}
                resultMatrix[i][k] = temp;
            }
        }
        defaultBackground();
        renderResultMatrix(resultMatrix);
    }


    /**
     * Отрисовываем Матрицу C
     * @param resultArray {Array} При получени двумерного массива, отрисует матрицу C
     */
    function renderResultMatrix(resultArray){
        var rowsMatrix = resultArray.length,
            colsMatrix = resultArray[0].length,
            placeholderRow = 1,
            html = '';

        for (var row = 0; row < rowsMatrix; row++){
            var placeholderCol = 1;
            html += '<tr>';
            for (var col =0; col < colsMatrix; col++){
                var placeholder = placeholderRow +','+ placeholderCol;
                html += '<td>' + '<input disabled type="text"  id="" placeholder="c'+ placeholder +'" value="'+ resultArray[col][row] +'"></td>';
            }
            html += '</tr>';
        }
        matrixResult.innerHTML = html;
    }

    /**
     * Конвертируем введённые данные в матрицу в двумерный массив
     * @param table Указатель на объект Table в который вводили данные
     * @returns {Array} Вернёт двумерный массив
     */
    function convertTableToMatrix(table){
        var rowsCount = table.rows.length,
            colsCount = table.rows[0].cells.length,
            matrix=[];

        for(var i = 0; i < rowsCount; i++){
            matrix[i] = [];
            for(var j = 0; j < colsCount; j++){
                //проверяем входные данные
                matrix[i][j] = table.rows[i].cells[j].getElementsByTagName("input")[0].value;
                if (!isNumeric(matrix[i][j])){
                    warningMessage(ERRORMATRIXTYPE);
                    return false;
                }
            }
        }
        return matrix;
    }


     window.onload = function () {

         //Button отрисовываем начальные матрицы
         defaultBackground();
         var c = setSizeMatrix(matrixRowA,matrixColB);
         renderResultMatrix(c);
         renderMatrix(a,"matrix-a");
         renderMatrix(b,"matrix-b");

        //Button "перемножение матриц"
        btnMultiplyMatrix.addEventListener("click", function () {
            a = convertTableToMatrix(getMatrixA);
            b = convertTableToMatrix(getMatrixB);
            MultiplyMatrix(a,b);

        },false);

        //Button очищаем матрицы
        clearMatrix.addEventListener("click", function () {

            a = setSizeMatrix(matrixRowA,matrixColA),
            b = setSizeMatrix(matrixRowB,matrixColB);
            renderMatrix(a,"matrix-a");
            renderMatrix(b,"matrix-b");
            /*MultiplyMatrix(a,b);
            defaultBackground();*/
            var c = setSizeMatrix(matrixRowA,matrixColB);
            renderResultMatrix(c);

        },false);


         /**
         * @todo разобраться, почему при смене местами матриц, происходит транспонирование
         */
        //меняем местами матрицы
        changeMatrix.addEventListener("click", function () {
            a = convertTableToMatrix(getMatrixA);
            b = convertTableToMatrix(getMatrixB);
            renderMatrix(b,"matrix-a");
            renderMatrix(a,"matrix-b");

        },false);

         /**
          * @todo придумать как ЭТО можно сократить
          * Тут отрабатываем нажатия кнопок добавления\убавления колонок\строк.
          */
        increaseRow.addEventListener("click", function () {
            if (radioMatrixChecked() == "matrixA"){
                matrixRowA = matrixSizeLimit(matrixRowA,"+");
                var a = setSizeMatrix(matrixRowA,matrixColA);
                renderMatrix(a,"matrix-a");
                var c = setSizeMatrix(matrixRowA,matrixColB);
                renderMatrix(c,"matrix-result");

            }
            if (radioMatrixChecked() == "matrixB"){
                matrixRowB = matrixSizeLimit(matrixRowB,"+");
                var b = setSizeMatrix(matrixRowB,matrixColB);
                renderMatrix(b,"matrix-b");
            }
        },false);
        decreaseRow.addEventListener("click", function () {
            if (radioMatrixChecked() == "matrixA"){
                matrixRowA = matrixSizeLimit(matrixRowA,"-");
                var a = setSizeMatrix(matrixRowA,matrixColA);
                renderMatrix(a,"matrix-a");
                var c = setSizeMatrix(matrixRowA,matrixColB);
                renderMatrix(c,"matrix-result");


            }
            if (radioMatrixChecked() == "matrixB"){
                matrixRowB = matrixSizeLimit(matrixRowB,"-");
                var b = setSizeMatrix(matrixRowB,matrixColB);
                renderMatrix(b,"matrix-b");
            }
        },false);
        increaseCol.addEventListener("click", function () {
            if (radioMatrixChecked() == "matrixA"){
                matrixColA = matrixSizeLimit(matrixColA,"+");
                var a = setSizeMatrix(matrixRowA,matrixColA);
                renderMatrix(a,"matrix-a");


            }
            if (radioMatrixChecked() == "matrixB"){
                matrixColB = matrixSizeLimit(matrixColB,"+");
                var b = setSizeMatrix(matrixRowB,matrixColB);
                renderMatrix(b,"matrix-b");
            }
        },false);
        decreaseCol.addEventListener("click", function () {
            if (radioMatrixChecked() == "matrixA"){
                matrixColA = matrixSizeLimit(matrixColA,"-");
                var a = setSizeMatrix(matrixRowA,matrixColA);
                renderMatrix(a,"matrix-a");

            }
            if (radioMatrixChecked() == "matrixB"){
                matrixColB  = matrixSizeLimit(matrixColB,"-");
                var b = setSizeMatrix(matrixRowB,matrixColB);
                renderMatrix(b,"matrix-b");
            }
        },false);


    };

})();



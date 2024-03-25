let board = [
    ["","hound","","",""],
    ["hound","","","","hare"],
    ["","hound","","",""],
]

let stallCounter=0
let selectedElement; // Definisci selectedElement qui
let isElementSelected = false; // Variabile booleana per tenere traccia dello stato di selezione

let turnCounter = 0
tab=document.getElementById('turncounter')
tab.innerHTML=isTurn()

function isTurn() {
    if (turnCounter%2==0){
        return "hound"
    }else if(turnCounter%2!=0){
        return "hare"
    }
}

function renderPG(){
    for (let index = 0; index < board.length; index++) {
        
        for (let j = 0; j < board[index].length; j++) {
            var el1 = document.querySelector(`.row${index+1} .box${j+1}`)
            if (board[index][j]=="hound"){
                el1.classList.add("dogBG")
            }else if (board[index][j]=="hare"){
                el1.classList.add("hareBG")
            }else{
                el1.classList.remove("hareBG","dogBG")
            }            
        }       
    }
}

document.getElementById('renderButton').addEventListener('click', function() {
    renderPG();
});




function changeColor(event) {
    if (!isElementSelected) {
        // Se nessun elemento è selezionato, consenti la selezione in base al turno
        if (event.target.classList.contains(isTurn()=="hound" ? "dogBG" : "hareBG" )){
            event.target.classList.add("selected");
            selectedElement = event.target;
            isElementSelected = true;
        

            // Rimuovi l'event listener dai box non selezionati
            document.querySelectorAll(".b").forEach((box) => {
                if (box !== selectedElement) {
                    box.removeEventListener("click", changeColor);
                }
            });
        }
    } else {
        // Se un elemento è già selezionato e viene cliccato nuovamente, deselezionalo
        if (event.target === selectedElement) {
            selectedElement.classList.remove("selected");
            isElementSelected = false;

            // Aggiungi nuovamente l'event listener di selezione agli altri box
            document.querySelectorAll(".b").forEach((box) => {
                box.addEventListener("click", changeColor);
            });

            return;
        } else {
            // Altrimenti, esci dalla funzione
            return;
        }
    }
}


function getIndices(element) {
    // Trova la riga su cui si trova l'elemento cliccato
    const row = element.closest('.row');

    // Trova gli elementi con la classe "b" all'interno della riga
    const boxes = Array.from(row.querySelectorAll('.b'));

    // Trova l'indice della colonna all'interno della riga
    const columnIndex = boxes.indexOf(element);

    // Trova l'indice della riga all'interno del suo genitore
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);

    return { rowIndex, columnIndex };
}

// function handleClick(event) {
//     const { rowIndex, columnIndex } = getIndices(event.target);
//     console.log("Indice verticale:", rowIndex);
//     console.log("Indice orizzontale:", columnIndex);
// }



function handleMouseOver(event) {
    if (!selectedElement) return; // Se non c'è alcun elemento selezionato, esci dalla funzione

    console.log(selectedElement)
    const { rowIndex: selectedRowIndex, columnIndex: selectedColumnIndex } = getIndices(selectedElement);
    const { rowIndex, columnIndex } = getIndices(event.target);
    const selectedAnimal = selectedElement.classList.contains('dogBG') ? 'hound' : (selectedElement.classList.contains('hareBG') ? 'hare' : 'empty');
    const diagonalMovementsAllowed = parseInt(event.target.getAttribute('data-diagonal-movements')) === 1;
    const destinationAnimal = event.target.classList.contains('dogBG') ? 'hound' : (event.target.classList.contains('hareBG') ? 'hare' : 'empty');


    if (isMoveAllowed(selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal, destinationAnimal, diagonalMovementsAllowed)) {
        // Se la mossa è consentita, cambia lo stile della casella di destinazione
        event.target.style.backgroundColor = 'green'; // Ad esempio, cambia il colore di sfondo in verde
    }
}

function handleClick(event) {
    const { rowIndex: selectedRowIndex, columnIndex: selectedColumnIndex } = getIndices(selectedElement);
    const { rowIndex, columnIndex } = getIndices(event.target);
    const selectedAnimal = selectedElement.classList.contains('dogBG') ? 'hound' : (selectedElement.classList.contains('hareBG') ? 'hare' : 'empty');
    const destinationAnimal = event.target.classList.contains('dogBG') ? 'hound' : (event.target.classList.contains('hareBG') ? 'hare' : 'empty');

    const diagonalMovementsAllowed = parseInt(event.target.getAttribute('data-diagonal-movements')) === 1;

    console.log("aaaa1")
    // Rimuovi temporaneamente il listener per il cambio di colore
    document.querySelectorAll('.b').forEach(box => {
        box.removeEventListener('click', changeColor);
    });
    console.log("ris", isMoveAllowed(selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal, destinationAnimal, diagonalMovementsAllowed))
    console.log(selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal, destinationAnimal, diagonalMovementsAllowed)
    console.log("animale destinaziomne", destinationAnimal)
    if (isMoveAllowed(selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal,destinationAnimal, diagonalMovementsAllowed)) {
        //controllo per il counter dello stallo
        const rowDifference = rowIndex - selectedRowIndex;
        const columnDifference = columnIndex - selectedColumnIndex;
        const absoluteRowDifference = Math.abs(rowDifference);
        const absoluteColumnDifference = Math.abs(columnDifference);

    // if (selectedAnimal=='hound'){
    //     stallCounter=0
    //     console.log("LO STALLO CONTATORE è",    stallCounter)
    // }
        
        //se il movimento delle hound è solamente verticale devo contare i turni per lo stallo
        if (selectedAnimal== 'hound' && absoluteRowDifference==1 && absoluteColumnDifference==0){
            stallCounter++
            console.log("LO STALLO CONTATORE è",    stallCounter)
        //altrimenti devo azzerare il counter
        }else if(selectedAnimal== 'hound' && absoluteColumnDifference==1){
            stallCounter=0
            console.log("LO STALLO CONTATORE è",    stallCounter)
        }


        // Se il movimento è consentito, aggiorna l'array bidimensionale
        board[rowIndex][columnIndex] = selectedAnimal;
        board[selectedRowIndex][selectedColumnIndex] = ''; // Rimuovi l'animale dalla casella precedente
        // Rendi la casella selezionata vuota nell'interfaccia grafica
        selectedElement.classList.remove('dogBG', 'hareBG');

        // Aggiorna l'interfaccia grafica del go
        renderPG();
        selectedElement.classList.remove("selected");
        isElementSelected = false;
        victoryCheck()
        turnCounter++
        (document.getElementById('turncounter')).innerHTML=isTurn()
    }
    console.log("arrivo qua")
    // Ripristina il listener per il cambio di colore
    document.querySelectorAll('.b').forEach(box => {
        box.addEventListener('click', changeColor);
    });
}

document.querySelectorAll('.b').forEach(box => {
    box.addEventListener('mouseover', handleMouseOver);
    box.addEventListener('click', handleClick);
});

function isMoveAllowed(selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal,destinationAnimal, diagonalMovementsAllowed) {
    const rowDifference = rowIndex - selectedRowIndex;
    const columnDifference = columnIndex - selectedColumnIndex;
    const absoluteRowDifference = Math.abs(rowDifference);
    const absoluteColumnDifference = Math.abs(columnDifference);
    // console.log(selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal)
    // console.log( selectedColumnIndex, columnIndex,columnDifference, selectedAnimal)
    // console.log( selectedRowIndex, rowIndex, rowDifference)
    // console.log(destinationAnimal)
    console.log("funzione allowed",selectedRowIndex, selectedColumnIndex, rowIndex, columnIndex, selectedAnimal, destinationAnimal, diagonalMovementsAllowed)


    // Se la casella selezionata è vuota, la mossa non è consentita
    if (selectedAnimal === 'empty') {
        console.log("A")
        return false;
        
    }

    if (destinationAnimal != 'empty') {
        console.log("B")
        return false;
    }


    // Controllo delle mosse in avanti (verticale) per le hound
    if (selectedAnimal === 'hound' && absoluteRowDifference>1) {
        // Le hound possono muoversi solo in avanti
        console.log("C")
        return false;
    }

    if (selectedAnimal === 'hound' && columnDifference < 0) {
        // Le hound possono muoversi solo in avanti
        console.log("D")
        return false;
    }

    // Controllo delle mosse orizzontali (destra/sinistra) e verticali (su/giù)
    if ((absoluteRowDifference === 0 && absoluteColumnDifference === 1) || (absoluteRowDifference === 1 && absoluteColumnDifference === 0)) {
        // La mossa è consentita se la differenza orizzontale o verticale è di una casella
        console.log("E")
        
        return true;
    }

    // Controllo delle mosse diagonali
    if (diagonalMovementsAllowed && absoluteRowDifference === 1 && absoluteColumnDifference === 1) {
        // La mossa è consentita se la differenza sia verticale che orizzontale è di una casella
        console.log("F")
        
        return true;
    }

    // Verifica se la casella di destinazione è occupata da una hound o una hare
    const destinationBox = document.querySelector(`.row${rowIndex + 1} .box${columnIndex + 1}`);
    if (destinationBox.classList.contains('dogBG') || destinationBox.classList.contains('hareBG')) {
        console.log("G")
        return false; // Il movimento non è consentito se la casella di destinazione è occupata
    }

    console.log("H")
    // Se non è stata soddisfatta nessuna delle condizioni precedenti, la mossa non è consentita
    return false;
}

// document.querySelectorAll('.b').forEach(box => {
//     box.addEventListener('mouseover', handleMouseOver);
// });

function handleMouseLeave(event) {
    event.target.style.backgroundColor = ''; // Rimuove il colore di sfondo impostato
}

// Aggiungi event listener per il mouseleave su ogni box
document.querySelectorAll('.b').forEach(box => {
    box.addEventListener('mouseleave', handleMouseLeave);
});

function victoryCheck(){
    if (stallCounter>=10){
        console.log("VINCE L'HARE!!!")
    }else if (board[0][2]=="hare"){
        if (board[0][1]=="hound" && board[0][3]=="hound" && board[1][2]=="hound"){
            console.log("VINCONO LE HOUND!!!")
        }
    }else if (board[2][2]=="hare"){
        if (board[2][1]=="hound" && board[2][3]=="hound" && board[1][2]=="hound"){
            console.log("VINCONO LE HOUND!!!")
        }
    
    }else if (board[1][4]=="hare"){
        if (board[0][3]=="hound" && board[1][3]=="hound" && board[2][3]=="hound"){
            console.log("VINCONO LE HOUND!!!")
        }
        
    }else if (board[1][0]=="hare"){
        console.log("VINCE L'HARE!!!")
    }
}
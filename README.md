# Frontenders Community

## Challenge #11 - Currency Exchange
Il design della challenge è ispirato da [questo lavoro](https://dribbble.com/shots/8171294-Currency-Converter-Animation-Concept) di Eugeniusz Eudokimov.

L'utente ha la possibilità di convertire il valore di una valuta in un'altra tramite i due box in basso. Ogni box ha:
- una select tramite cui è possibile selezionare una valuta
- un input numerico dove è possibile inserire un valore monetario

La lista di valute viene fornita dall'API [Frankfurter](https://www.frankfurter.app/docs/). Anche la conversione da una valuta all'altra viene fatta tramite API. Sempre tramite API viene generato un grafico (box sopra) che mostra il rapporto tra la valuta di origine (selezionata nel box a sinistra) e la valuta di destinazione (selezionata nel box di destra).


### Tecnologie
E' consigliato svolgere la challenge con un framework (React, Vue o altro). Il grafico è realizzato con chart-js, che presenta dei wrapper anche per i principali framework. Si può comunque scegliere un'altra libreria. Lo stile del grafico è solo d'ispirazione.

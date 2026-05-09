Intrebarea 1 Ce are loc dupa publicarea comenzii de catre client?
Solutia 1 : Ca in Yandex algoritmul automat ii da montatorului comanda ca el so accepte. Algoritmul ia in calcul: disponibilitatea montatorului (daca nu are programat la aceeasi ora inca o comanda deja); ratingul care il are si locatia care o are.
Solutia 2: Ca la Letz Taxi, automat se genereaza comenzile pe un dashboard si montatorii le aleg. Mai multi montatori pot alege aceasi comanda iar algoritmul ii ofera
comanda celui cu rating mai mare.
Solutia 3: ceva mixt sa fie dintre prima solutie si a doua. 
Pe dashboard sa fie afisate comenzile care montatorii le aleg. Cand pe o comanda apasa mai multi montatori atunci i se ofera celui cu activitate si rating mai mare. 
Comenzile care nu sunt acceptate de nici un montator in decurs de cateva ore sunt trimise silit sa fie acceptate de cineva din montatori, daca primul montator 
refuza atunci i se scade din activitate si comanda este trimisa la acceptare urmatorui montator care o accepta si isi ridica indicele de activitate sau il mentine inalt.



IDEE: propun pe langa rating sa mai fie asa parametru ca activitate, cum in Yandex. Diferenta e ca ratingul il formeza clientii iar activitatea o formeza montatorul.
De exmplu activitatea ramane 10/10 cand montatorul accepta multe comenzi zilnic sau cand accepta comenzile care algoritmul i le da silit (de exemplu: comenzi care 
nimeni nu le-a acceptat timp de 6 ore ). Pentru noi conteaza in primul rand ca montatorul sa accepte cat mai multe comenzi(sa aiba un indice de activitate inalt), iar pe locul doi deja e ratingul care este dat de client.

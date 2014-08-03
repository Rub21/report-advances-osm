report-advances-osm
===================

Esta herramienta permite obtener los avances que un usuario en una determinada fecha.

utiliza datos de : http://planet.osm.org/replication/day/000/000/


Reporte desde el :07/21/2014 = 677 al 07/26/2014 = 682

##### Ejecutar con usuarios determinados

se ejecuta para los usuarios Rub21,ediyes,Luis36995

`$ ./report-day 677 682  Rub21,ediyes,Luis36995`

resultado:

#### Highway
|User | All highways | Version 1 | Version > 1 | Bridges | Oneways |
|---------|--------------|--------------|--------------|--------------|--------------|
Rub21|4,108|1,160|2,948|132|1,821
ediyes|4,547|727|3,820|91|1,063
Luis36995|1,699|268|1,431|53|677
**Total**| **10,354** | **2,155** | **8,199** | **276** | **3,561**
#### Buildings
| User | All buildings | version 1 | version > 1 |
|---------|--------------|--------------|--------------|
Rub21|11,859|0|11,859
ediyes|3|0|3
Luis36995|151|1|150
**Total**| **12,013** | **1** | **12,012**


##### Otra forma de ejecutar:

`$ node index.js --start=677 --end=682 --users=Rub21,ediyes,Luis36995`

Esto funciona en caso de que se tenga ya los archivos descargados y descomprimidos.




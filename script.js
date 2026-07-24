/* =====================================================
   KALKULATOR AKTA KERJA 1955
   SCRIPT.JS
   PROFESSIONAL CLEAN VERSION

   PART 1/5

   SECTION:
   - Global Helper
   - Input Formula Engine
   - Currency Format Engine
   - Date Engine
   - Monthly Calculation Engine
   - Salary Engine
   - Auto Salary Update

===================================================== */



/* =====================================================
   SECTION 1
   GLOBAL DOM HELPER
===================================================== */


function getElement(id){

    return document.getElementById(id);

}



function setText(id,value){

    const element = getElement(id);

    if(element){

        element.innerHTML = value;

    }

}



function setValue(id,value){

    const element = getElement(id);

    if(element){

        element.value = value;

    }

}



/* =====================================================
   SECTION 2
   MONEY FORMAT ENGINE

   Output:
   RM 1,000.00

===================================================== */


function formatRM(value){

    value = Number(value) || 0;


    return "RM " +
    value.toLocaleString(
        "en-MY",
        {

            minimumFractionDigits:2,

            maximumFractionDigits:2

        }
    );

}




/* =====================================================
   SECTION 3
   INPUT FORMULA ENGINE

   Support:

   2500

   =2500+300

   =2500+300+200


   Digunakan untuk:

   - Gaji Pokok
   - Elaun
   - Semua calculator

===================================================== */


function calculateInput(value){


    if(
        !value ||
        value.trim()===""
    ){

        return 0;

    }



    value =
    value
    .replace("=","")
    .trim();



    /*
       Security filter

       Hanya benarkan:
       nombor
       +
       -
       *
       /
       ()
       titik perpuluhan

    */


    if(
        !/^[0-9+\-*/().\s]+$/
        .test(value)
    ){

        return 0;

    }



    try{


        let result =
        Function(
            "return ("+
            value+
            ")"
        )();



        return Number(result) || 0;


    }

    catch(error){

        return 0;

    }


}




function getInputNumber(id){


    const element =
    getElement(id);



    if(!element){

        return 0;

    }



    return calculateInput(
        element.value
    );


}





/* =====================================================
   SECTION 4
   DATE ENGINE

   Digunakan oleh:

   - GGN Hari
   - GGN Minggu
   - Seksyen 18A


===================================================== */



function formatDateInput(date){


    const year =
    date.getFullYear();



    const month =
    String(
        date.getMonth()+1
    )
    .padStart(2,"0");



    const day =
    String(
        date.getDate()
    )
    .padStart(2,"0");



    return (

        year+
        "-" +
        month+
        "-" +
        day

    );

}




function getDaysInMonth(
    year,
    month
){


    return new Date(

        year,

        month + 1,

        0

    )
    .getDate();


}





function getMalayMonthYear(date){


    return date.toLocaleString(
        "ms-MY",
        {

            month:"long",

            year:"numeric"

        }
    );

}






/* =====================================================
   SECTION 5
   MONTHLY SALARY CALCULATION ENGINE


   Formula:

   Jumlah Upah
   ÷
   Hari Kalender Bulan
   ×
   Hari Terlibat


   Support:

   ✓ Bulan sama

   ✓ Banyak bulan

   ✓ Lintas tahun


===================================================== */


function calculateSalaryByDateRange(

    salary,

    startDate,

    endDate

){


    let total = 0;



    let current =
    new Date(startDate);



    while(
        current <= endDate
    ){



        let year =
        current.getFullYear();



        let month =
        current.getMonth();



        let daysInMonth =
        getDaysInMonth(
            year,
            month
        );



        let startDay =
        current.getDate();



        let endDay =
        daysInMonth;



        if(

            year === endDate.getFullYear()
            &&
            month === endDate.getMonth()

        ){

            endDay =
            endDate.getDate();

        }



        let days =
        endDay
        -
        startDay
        +
        1;



        let dailyRate =
        salary /
        daysInMonth;



        total +=
        dailyRate *
        days;



        current =
        new Date(

            year,

            month+1,

            1

        );


    }



    return total;


}







/* =====================================================
   MONTHLY BREAKDOWN ENGINE


   Output:

   [
      {
        month,
        year,
        days,
        dailyRate,
        amount
      }
   ]


   Digunakan oleh:

   Seksyen 18A


===================================================== */


function getMonthlyBreakdown(

    salary,

    startDate,

    endDate

){


    let result=[];



    let current =
    new Date(startDate);



    while(
        current <= endDate
    ){



        let year =
        current.getFullYear();



        let month =
        current.getMonth();



        let daysInMonth =
        getDaysInMonth(
            year,
            month
        );



        let firstDay =
        current.getDate();



        let lastDay =
        daysInMonth;



        if(

            year === endDate.getFullYear()
            &&
            month === endDate.getMonth()

        ){

            lastDay =
            endDate.getDate();

        }



        let days =
        lastDay
        -
        firstDay
        +
        1;



        let dailyRate =
        salary /
        daysInMonth;



        result.push({

            year:year,

            month:month,

            daysInMonth:daysInMonth,

            days:days,

            dailyRate:dailyRate,

            amount:
            dailyRate * days

        });



        current =
        new Date(

            year,

            month+1,

            1

        );


    }



    return result;


}







/* =====================================================
   SECTION 6
   SALARY ENGINE


   Formula:

   Gaji Pokok
   +
   Elaun


===================================================== */



function updateSalaryTotal(

    basicID,

    allowanceID,

    totalID

){



    let basic =
    getInputNumber(
        basicID
    );



    let allowance =
    getInputNumber(
        allowanceID
    );



    let total =
    basic +
    allowance;



    setValue(

        totalID,

        formatRM(total)

    );



    return total;


}








/* =====================================================
   SECTION 7
   SALARY FIELD DATABASE


   Tambah calculator baru
   hanya di sini


===================================================== */


const SALARY_FIELDS = {


    ORP:{

        basic:
        "orpBasicSalary",

        allowance:
        "orpAllowance",

        total:
        "orpTotalSalary"

    },



    OT:{

        basic:
        "otBasicSalary",

        allowance:
        "otAllowance",

        total:
        "otTotalSalary"

    },



    OTRH:{

        basic:
        "otRHBasicSalary",

        allowance:
        "otRHAllowance",

        total:
        "otRHTotalSalary"

    },



    SECTION18A:{

        basic:
        "section18ABasicSalary",

        allowance:
        "section18AAllowance",

        total:
        "section18ATotalSalary"

    },



    GGN:{

        basic:
        "ggnBasicSalary",

        allowance:
        "ggnAllowance",

        total:
        "ggnTotalSalary"

    },


    GGN_DAY:{

        basic:
        "ggnDaySalary",

        allowance:
        "ggnDayAllowance",

        total:
        "ggnDayTotalSalary"

    }


};







/* =====================================================
   SECTION 8
   AUTO UPDATE TOTAL SALARY


   Bila user taip:

   Gaji Pokok

   atau

   Elaun


   Jumlah Upah update automatik


===================================================== */


function setupSalaryAutoUpdate(){



    document.addEventListener(

        "input",

        function(event){



            const id =
            event.target.id;



            Object.values(
                SALARY_FIELDS
            )
            .forEach(

                field=>{


                    if(

                        id === field.basic

                        ||

                        id === field.allowance

                    ){


                        updateSalaryTotal(

                            field.basic,

                            field.allowance,

                            field.total

                        );


                    }


                }

            );


        }

    );


}






/* =====================================================
   END OF PART 1/5

   NEXT:

   PART 2/5

   - ORP Calculator
   - OT Biasa
   - OT Hari Rehat
   - Hari Rehat
   - Hari Kelepasan

===================================================== */
/* =====================================================
   KALKULATOR AKTA KERJA 1955
   SCRIPT.JS
   PROFESSIONAL CLEAN VERSION

   PART 2/5

   SECTION:
   - ORP Calculator
   - OT Biasa
   - OT Hari Rehat
   - Kerja Hari Rehat
   - Hari Kelepasan

===================================================== */



/* =====================================================
   SECTION 9
   ORP (KADAR UPAH BIASA)


   Formula:

   (Gaji Pokok + Elaun)
   ÷
   26


===================================================== */


function calculateORP(){



    let totalSalary =

    updateSalaryTotal(

        SALARY_FIELDS.ORP.basic,

        SALARY_FIELDS.ORP.allowance,

        SALARY_FIELDS.ORP.total

    );



    let ORP =
    totalSalary / 26;



    setText(

        "orpResultTotal",

        formatRM(totalSalary)

    );



    setText(

        "orpResult",

        formatRM(ORP)

    );



    localStorage.setItem(

        "ORP",

        ORP.toFixed(2)

    );


}






function getORP(){


    let totalSalary =

    updateSalaryTotal(

        SALARY_FIELDS.ORP.basic,

        SALARY_FIELDS.ORP.allowance,

        SALARY_FIELDS.ORP.total

    );


    return totalSalary / 26;


}







function resetORP(){



    clearFields([

        "orpBasicSalary",

        "orpAllowance"

    ]);



    setValue(

        "orpTotalSalary",

        "RM 0.00"

    );



    resetResults([

        "orpResultTotal",

        "orpResult"

    ]);



    localStorage.removeItem(

        "ORP"

    );


}







/* =====================================================
   SECTION 10
   OT HARI BIASA


   Formula:


   ORP
   ÷
   Jam Kerja Normal


   ×
   1.5


   ×
   Jam OT


===================================================== */


function calculateOTBiasa(){



    let totalSalary =

    updateSalaryTotal(

        SALARY_FIELDS.OT.basic,

        SALARY_FIELDS.OT.allowance,

        SALARY_FIELDS.OT.total

    );



    let hours =

    Number(

        getElement(
            "otHours"
        ).value

    );



    let workingHours =

    Number(

        getElement(
            "normalWorkingHours"
        ).value

    );



    if(!workingHours){


        alert(

            "Sila pilih jam kerja normal sehari."

        );


        return;

    }





    let ORP =

    totalSalary / 26;



    let hourly =

    (

        ORP /

        workingHours

    )

    *

    1.5;



    let amount =

    hourly *

    hours;





    renderOTResult(

        "otResultTotal",

        "otORP",

        "otHourly",

        "otAmount",

        totalSalary,

        ORP,

        hourly,

        amount

    );


}







function resetOTBiasa(){



    clearFields([

        "otBasicSalary",

        "otAllowance",

        "otHours"

    ]);



    setValue(

        "otTotalSalary",

        "RM 0.00"

    );



    setValue(

        "normalWorkingHours",

        ""

    );



    resetResults([

        "otResultTotal",

        "otORP",

        "otHourly",

        "otAmount"

    ]);


}







/* =====================================================
   SECTION 11
   OT HARI REHAT


   Formula:


   ORP

   ÷

   Jam Kerja Normal


   ×

   2.0


   ×

   Jam OT


===================================================== */


function calculateOTRH(){



    let totalSalary =

    updateSalaryTotal(

        SALARY_FIELDS.OTRH.basic,

        SALARY_FIELDS.OTRH.allowance,

        SALARY_FIELDS.OTRH.total

    );



    let hours =

    Number(

        getElement(
            "otRHHours"
        ).value

    );



    let workingHours =

    Number(

        getElement(
            "otRHNormalWorkingHours"
        ).value

    );




    if(!workingHours){


        alert(

            "Sila pilih jam kerja normal sehari."

        );


        return;

    }




    let ORP =

    totalSalary / 26;



    let hourly =

    (

        ORP /

        workingHours

    )

    *

    2;



    let amount =

    hourly *

    hours;





    renderOTResult(

        "otRHResultTotal",

        "otRHORP",

        "otRHHourly",

        "otRHAmount",

        totalSalary,

        ORP,

        hourly,

        amount

    );


}








function resetOTRH(){



    clearFields([

        "otRHBasicSalary",

        "otRHAllowance",

        "otRHHours"

    ]);



    setValue(

        "otRHTotalSalary",

        "RM 0.00"

    );



    setValue(

        "otRHNormalWorkingHours",

        ""

    );



    resetResults([

        "otRHResultTotal",

        "otRHORP",

        "otRHHourly",

        "otRHAmount"

    ]);


}








/* =====================================================
   SECTION 12
   KERJA HARI REHAT
   1/2 HARI ATAU KURANG


   Formula:


   ORP

   ×

   0.5


   ×

   Bilangan Hari


===================================================== */


function calculateHariRehat(){



    let totalSalary =

    updateSalaryTotal(

        "rhBasicSalary",

        "rhAllowance",

        "rhTotalSalary"

    );



    let days =

    Number(

        getElement(
            "rhDays"
        ).value

    );



    let ORP =

    totalSalary / 26;



    let daily =

    ORP * 0.5;



    let amount =

    daily *

    days;




    renderDailyResult(

        "rhResultTotal",

        "rhORP",

        "rhDaily",

        "rhAmount",

        totalSalary,

        ORP,

        daily,

        amount

    );


}







function resetHariRehat(){



    clearFields([

        "rhBasicSalary",

        "rhAllowance",

        "rhDays"

    ]);



    setValue(

        "rhTotalSalary",

        "RM 0.00"

    );



    resetResults([

        "rhResultTotal",

        "rhORP",

        "rhDaily",

        "rhAmount"

    ]);


}








/* =====================================================
   SECTION 13
   KERJA HARI REHAT
   LEBIH 1/2 HARI


   Formula:


   ORP

   ×

   Bilangan Hari


===================================================== */


function calculateHariRehatLebih(){



    let totalSalary =

    updateSalaryTotal(

        "rhMoreBasicSalary",

        "rhMoreAllowance",

        "rhMoreTotalSalary"

    );



    let days =

    Number(

        getElement(
            "rhMoreDays"
        ).value

    );



    let ORP =

    totalSalary / 26;



    let amount =

    ORP *

    days;





    renderDailyResult(

        "rhMoreResultTotal",

        "rhMoreORP",

        "rhMoreDaily",

        "rhMoreAmount",

        totalSalary,

        ORP,

        ORP,

        amount

    );


}








function resetHariRehatLebih(){



    clearFields([

        "rhMoreBasicSalary",

        "rhMoreAllowance",

        "rhMoreDays"

    ]);



    setValue(

        "rhMoreTotalSalary",

        "RM 0.00"

    );



    resetResults([

        "rhMoreResultTotal",

        "rhMoreORP",

        "rhMoreDaily",

        "rhMoreAmount"

    ]);

}









/* =====================================================
   SECTION 14
   KERJA PADA HARI KELEPASAN


   Formula:


   ORP

   ×

   2


   ×

   Bilangan Hari


===================================================== */


function calculatePH(){



    let totalSalary =

    updateSalaryTotal(

        "phBasicSalary",

        "phAllowance",

        "phTotalSalary"

    );



    let days =

    Number(

        getElement(
            "phDays"
        ).value

    );



    let ORP =

    totalSalary / 26;



    let daily =

    ORP * 2;



    let amount =

    daily *

    days;





    renderDailyResult(

        "phResultTotal",

        "phORP",

        "phDaily",

        "phAmount",

        totalSalary,

        ORP,

        daily,

        amount

    );


}








function resetPH(){



    clearFields([

        "phBasicSalary",

        "phAllowance",

        "phDays"

    ]);



    setValue(

        "phTotalSalary",

        "RM 0.00"

    );



    resetResults([

        "phResultTotal",

        "phORP",

        "phDaily",

        "phAmount"

    ]);


}






/* =====================================================
   SECTION 15
   OT HARI KELEPASAN


   Formula:


   ORP

   ÷

   Jam Kerja Normal


   ×

   3.0


   ×

   Jam OT


===================================================== */


function calculateOTPH(){



    let totalSalary =

    updateSalaryTotal(

        "otPHBasicSalary",

        "otPHAllowance",

        "otPHTotalSalary"

    );



    let hours =

    Number(

        getElement(
            "otPHHours"
        ).value

    );



    let workingHours =

    Number(

        getElement(
            "otPHWorkingHours"
        ).value

    );



    if(!workingHours){


        alert(

            "Sila pilih jam kerja normal sehari."

        );


        return;

    }





    let ORP =

    totalSalary / 26;



    let hourly =

    (

        ORP /

        workingHours

    )

    *

    3;



    let amount =

    hourly *

    hours;





    renderOTResult(

        "otPHResultTotal",

        "otPHORP",

        "otPHHourly",

        "otPHAmount",

        totalSalary,

        ORP,

        hourly,

        amount

    );


}







function resetOTPH(){



    clearFields([

        "otPHBasicSalary",

        "otPHAllowance",

        "otPHHours"

    ]);



    setValue(

        "otPHTotalSalary",

        "RM 0.00"

    );



    setValue(

        "otPHWorkingHours",

        ""

    );



    resetResults([

        "otPHResultTotal",

        "otPHORP",

        "otPHHourly",

        "otPHAmount"

    ]);


}









/* =====================================================
   SHARED DISPLAY ENGINE

===================================================== */


function renderOTResult(

    totalID,

    orpID,

    hourlyID,

    amountID,

    total,

    ORP,

    hourly,

    amount

){


    setText(

        totalID,

        formatRM(total)

    );


    setText(

        orpID,

        formatRM(ORP)

    );


    setText(

        hourlyID,

        formatRM(hourly)

    );


    setText(

        amountID,

        formatRM(amount)

    );


}





function renderDailyResult(

    totalID,

    orpID,

    dailyID,

    amountID,

    total,

    ORP,

    daily,

    amount

){


    setText(

        totalID,

        formatRM(total)

    );


    setText(

        orpID,

        formatRM(ORP)

    );


    setText(

        dailyID,

        formatRM(daily)

    );


    setText(

        amountID,

        formatRM(amount)

    );


}







/* =====================================================
   COMMON RESET ENGINE

===================================================== */


function clearFields(ids){


    ids.forEach(

        id=>{

            const element =
            getElement(id);


            if(element){

                element.value="";

            }

        }

    );


}



function resetResults(ids){


    ids.forEach(

        id=>{

            setText(

                id,

                "RM 0.00"

            );

        }

    );


}





/* =====================================================
   END OF PART 2/5

   NEXT:

   PART 3/5

   - Gaji Ganti Notis Bulan
   - Gaji Ganti Notis Minggu
   - Gaji Ganti Notis Hari
   - Auto Tarikh Akhir Notis

===================================================== */
/* =====================================================
   KALKULATOR AKTA KERJA 1955
   SCRIPT.JS
   PROFESSIONAL CLEAN VERSION

   PART 3/5

   SECTION:
   - Gaji Ganti Notis (Bulan)
   - Gaji Ganti Notis (Minggu)
   - Gaji Ganti Notis (Hari)
   - Shared GGN Engine
   - Auto Date Calculation

===================================================== */





/* =====================================================
   SECTION 16
   GGN BULAN


   Formula:

   Jumlah Upah
   ×
   Bilangan Bulan


===================================================== */


function calculateGGNMonth(){


    let totalSalary =

    updateSalaryTotal(

        SALARY_FIELDS.GGN.basic,

        SALARY_FIELDS.GGN.allowance,

        SALARY_FIELDS.GGN.total

    );



    let months =

    Number(

        getElement(
            "ggnMonthNotice"
        ).value

    );



    if(months <= 0){


        alert(
            "Sila masukkan bilangan bulan notis."
        );


        return;

    }





    let amount =

    totalSalary *

    months;




    setText(

        "ggnResultType",

        "Bulan"

    );



    setText(

        "ggnResultMonth",

        months + " Bulan"

    );



    setText(

        "ggnAmount",

        formatRM(amount)

    );


}








/* =====================================================
   SECTION 17
   GGN MINGGU


   Formula:


   Bilangan Minggu

   ×

   7 Hari


   Bayaran:

   Kadar harian ikut bulan kalender


===================================================== */


function calculateGGNWeek(){



    let totalSalary =

    updateSalaryTotal(

        "ggnWeekBasicSalary",

        "ggnWeekAllowance",

        "ggnWeekTotalSalary"

    );




    let weeks =

    Number(

        getElement(
            "ggnWeekNotice"
        ).value

    );




    let startDate =

    getElement(
        "ggnWeekStartDate"
    ).value;




    if(

        weeks <=0 ||

        !startDate

    ){


        alert(

            "Sila masukkan bilangan minggu dan Tarikh Mula Notis."

        );


        return;

    }





    let totalDays =

    weeks *

    7;



    let start =

    new Date(startDate);



    let end =

    new Date(start);



    end.setDate(

        end.getDate()

        +

        totalDays

        -

        1

    );





    let amount =

    calculateSalaryByDateRange(

        totalSalary,

        start,

        end

    );





    setValue(

        "ggnWeekEndDate",

        formatDateInput(end)

    );





    setText(

        "ggnWeekDays",

        totalDays +

        " Hari"

    );





    setText(

        "ggnWeekResultEndDate",

        end.toLocaleDateString(
            "ms-MY"
        )

    );





    setText(

        "ggnWeekAmount",

        formatRM(amount)

    );



}










/* =====================================================
   AUTO TARIKH AKHIR GGN MINGGU

===================================================== */


function autoGGNWeekEndDate(){



    let start =

    getElement(
        "ggnWeekStartDate"
    );



    let weeks =

    getElement(
        "ggnWeekNotice"
    );



    let end =

    getElement(
        "ggnWeekEndDate"
    );



    if(

        !start ||

        !weeks ||

        !end

    ){

        return;

    }





    if(

        !start.value ||

        Number(weeks.value)<=0

    ){


        end.value="";


        return;

    }





    let date =

    new Date(
        start.value
    );



    date.setDate(

        date.getDate()

        +

        (
            Number(weeks.value)

            *

            7

        )

        -

        1

    );





    end.value =

    formatDateInput(date);



}









/* =====================================================
   SECTION 18
   GGN HARI


   Formula:


   Bilangan Hari

   →

   Tarikh mula

   →

   Tarikh akhir


   Bayaran:

   Kadar harian berdasarkan
   hari kalender setiap bulan


===================================================== */





function calculateGGNDay(){



    let totalSalary =

    updateSalaryTotal(

        "ggnDaySalary",

        "ggnDayAllowance",

        "ggnDayTotalSalary"

    );





    let days =

    Number(

        getElement(
            "ggnDayNoticeDays"
        ).value

    );





    let startDate =

    getElement(
        "ggnDayStartDate"
    ).value;






    if(

        days<=0 ||

        !startDate

    ){


        alert(

            "Sila masukkan bilangan hari dan Tarikh Mula Notis."

        );


        return;

    }






    let start =

    new Date(startDate);





    let end =

    new Date(start);





    end.setDate(

        end.getDate()

        +

        days

        -

        1

    );





    let amount =

    calculateSalaryByDateRange(

        totalSalary,

        start,

        end

    );







    setValue(

        "ggnDayEndDate",

        formatDateInput(end)

    );





    setText(

        "ggnDayResultDays",

        days + " Hari"

    );





    setText(

        "ggnDayResultEndDate",

        end.toLocaleDateString(
            "ms-MY"
        )

    );





    setText(

        "ggnDayAmount",

        formatRM(amount)

    );



}









/* =====================================================
   AUTO TARIKH AKHIR GGN HARI

===================================================== */


function autoGGNDayEndDate(){



    let start =

    getElement(
        "ggnDayStartDate"
    );



    let days =

    getElement(
        "ggnDayNoticeDays"
    );



    let end =

    getElement(
        "ggnDayEndDate"
    );




    if(

        !start ||

        !days ||

        !end

    ){

        return;

    }






    if(

        !start.value ||

        Number(days.value)<=0

    ){


        end.value="";


        return;

    }





    let date =

    new Date(
        start.value
    );





    date.setDate(

        date.getDate()

        +

        Number(days.value)

        -

        1

    );





    end.value =

    formatDateInput(date);



}









/* =====================================================
   SECTION 19
   GGN RESET FUNCTIONS

===================================================== */





function resetGGN(){



    clearFields([


        "ggnBasicSalary",

        "ggnAllowance",

        "ggnNoticeType",

        "ggnMonthNotice",

        "ggnNoticePeriod",

        "ggnStartDate",

        "ggnEndDate"


    ]);





    setValue(

        "ggnTotalSalary",

        "RM 0.00"

    );





    setText(

        "ggnResultType",

        "-"

    );



    setText(

        "ggnResultMonth",

        "0 Bulan"

    );



    setText(

        "ggnNoticeDays",

        "0 Hari"

    );



    setText(

        "ggnAmount",

        "RM 0.00"

    );



}








function resetGGNDay(){



    clearFields([


        "ggnDaySalary",

        "ggnDayAllowance",

        "ggnDayStartDate",

        "ggnDayEndDate"


    ]);





    setValue(

        "ggnDayNoticeDays",

        "1"

    );





    setValue(

        "ggnDayTotalSalary",

        "RM 0.00"

    );





    setText(

        "ggnDayResultDays",

        "0 Hari"

    );





    setText(

        "ggnDayResultEndDate",

        "-"

    );





    setText(

        "ggnDayAmount",

        "RM 0.00"

    );


}








function resetGGNWeek(){



    clearFields([


        "ggnWeekBasicSalary",

        "ggnWeekAllowance",

        "ggnWeekStartDate",

        "ggnWeekEndDate"


    ]);





    setValue(

        "ggnWeekNotice",

        "1"

    );





    setValue(

        "ggnWeekTotalSalary",

        "RM 0.00"

    );





    setText(

        "ggnWeekDays",

        "0 Hari"

    );





    setText(

        "ggnWeekResultEndDate",

        "-"

    );





    setText(

        "ggnWeekAmount",

        "RM 0.00"

    );


}








/* =====================================================
   END OF PART 3/5


   NEXT:

   PART 4/5

   - Seksyen 18A
   - Cuti Tahunan
   - Cuti Sakit

===================================================== */
/* =====================================================
   KALKULATOR AKTA KERJA 1955
   SCRIPT.JS
   PROFESSIONAL CLEAN VERSION

   PART 4/5

   SECTION:
   - Seksyen 18A
   - Cuti Tahunan
   - Cuti Sakit

===================================================== */





/* =====================================================
   SECTION 20
   KALKULATOR SEKSYEN 18A


   Formula:


   Jumlah Upah

   ÷

   Hari Kalender Bulan

   ×

   Hari Bekerja Dalam Tempoh Upah



   Support:

   ✓ Bulan sama

   ✓ Banyak bulan

   ✓ Lintas tahun


===================================================== */





function calculateSection18A(){



    let totalSalary =

    updateSalaryTotal(


        SALARY_FIELDS.SECTION18A.basic,


        SALARY_FIELDS.SECTION18A.allowance,


        SALARY_FIELDS.SECTION18A.total


    );






    let startDate =

    getElement(
        "section18AStartDate"
    );



    let endDate =

    getElement(
        "section18AEndDate"
    );





    if(

        !startDate ||

        !endDate ||

        !startDate.value ||

        !endDate.value

    ){


        alert(

            "Sila masukkan tarikh mula dan tarikh akhir."

        );


        return;

    }






    let start =

    new Date(
        startDate.value
    );



    let end =

    new Date(
        endDate.value
    );






    if(end < start){


        alert(

            "Tarikh akhir tidak boleh lebih awal daripada tarikh mula."

        );


        return;


    }








    let breakdown =

    getMonthlyBreakdown(


        totalSalary,


        start,


        end


    );







    let totalAmount = 0;





    breakdown.forEach(

        item=>{


            totalAmount +=

            item.amount;


        }

    );







    /* ================================================
       OUTPUT JUMLAH UPAH
    ================================================ */



    setText(

        "resultTotalSalary",

        formatRM(totalSalary)

    );









    /* ================================================
       BULAN PERTAMA
    ================================================ */


    if(

        breakdown.length > 0

    ){



        renderSection18AMonth(

            breakdown[0],


            "month1Title",

            "month1Days",

            "month1Daily",

            "month1Amount"


        );


    }








    /* ================================================
       BULAN KEDUA

       Jika tiada bulan kedua,
       kosongkan output

    ================================================ */


    if(

        breakdown.length > 1

    ){



        renderSection18AMonth(

            breakdown[1],


            "month2Title",

            "month2Days",

            "month2Daily",

            "month2Amount"


        );


    }

    else{


        resetSection18AMonth(

            "month2Title",

            "month2Days",

            "month2Daily",

            "month2Amount"


        );


    }








    setText(

        "amount18A",

        formatRM(totalAmount)

    );



}









/* =====================================================
   RENDER BULAN SEKSYEN 18A

===================================================== */



function renderSection18AMonth(

    data,

    titleID,

    daysID,

    dailyID,

    amountID

){



    let date =

    new Date(

        data.year,

        data.month,

        1

    );





    setText(

        titleID,

        getMalayMonthYear(date)

    );





    setText(

        daysID,

        data.days +

        " Hari"

    );





    setText(

        dailyID,

        formatRM(

            data.dailyRate

        )

    );





    setText(

        amountID,

        formatRM(

            data.amount

        )

    );


}








function resetSection18AMonth(

    titleID,

    daysID,

    dailyID,

    amountID

){



    setText(

        titleID,

        "-"

    );



    setText(

        daysID,

        "-"

    );



    setText(

        dailyID,

        "-"

    );



    setText(

        amountID,

        "-"

    );


}









/* =====================================================
   RESET SEKSYEN 18A

===================================================== */


function resetSeksyen18A(){



    clearFields([


        "section18ABasicSalary",

        "section18AAllowance",

        "section18AStartDate",

        "section18AEndDate"


    ]);





    setValue(

        "section18ATotalSalary",

        "RM 0.00"

    );






    setText(

        "resultTotalSalary",

        "RM 0.00"

    );





    resetSection18AMonth(

        "month1Title",

        "month1Days",

        "month1Daily",

        "month1Amount"

    );





    resetSection18AMonth(

        "month2Title",

        "month2Days",

        "month2Daily",

        "month2Amount"

    );





    setText(

        "amount18A",

        "RM 0.00"

    );



}









/* =====================================================
   SECTION 21
   CUTI TAHUNAN


   Formula:


   ORP

   ×

   Bilangan Hari Cuti


===================================================== */





function calculateCutiTahunan(){



    let ORP =

    getORP();





    let days =

    Number(

        getElement(

            "annualLeaveDays"

        ).value

    );





    let amount =

    ORP *

    days;







    setText(

        "annualLeaveORP",

        formatRM(ORP)

    );






    setText(

        "annualLeaveAmount",

        formatRM(amount)

    );



}









function resetCutiTahunan(){



    clearFields([


        "annualLeaveDays"


    ]);





    resetResults([


        "annualLeaveORP",

        "annualLeaveAmount"


    ]);



}









/* =====================================================
   SECTION 22
   CUTI SAKIT


   Formula:


   ORP

   ×

   Bilangan Hari Cuti


===================================================== */





function calculateCutiSakit(){



    let ORP =

    getORP();





    let days =

    Number(

        getElement(

            "sickLeaveDays"

        ).value

    );





    let amount =

    ORP *

    days;








    setText(

        "sickLeaveORP",

        formatRM(ORP)

    );







    setText(

        "sickLeaveAmount",

        formatRM(amount)

    );



}









function resetCutiSakit(){



    clearFields([


        "sickLeaveDays"


    ]);





    resetResults([


        "sickLeaveORP",

        "sickLeaveAmount"


    ]);



}









/* =====================================================
   SECTION 23
   ADDITIONAL DATE LISTENERS


   Auto update:

   GGN Hari

   GGN Minggu


===================================================== */





function setupDateAutoCalculation(){



    let ggnDayStart =

    getElement(
        "ggnDayStartDate"
    );



    let ggnDayDays =

    getElement(
        "ggnDayNoticeDays"
    );



    let ggnWeekStart =

    getElement(
        "ggnWeekStartDate"
    );



    let ggnWeekDays =

    getElement(
        "ggnWeekNotice"
    );







    if(ggnDayStart){


        ggnDayStart.addEventListener(

            "change",

            autoGGNDayEndDate

        );


    }





    if(ggnDayDays){


        ggnDayDays.addEventListener(

            "input",

            autoGGNDayEndDate

        );


    }






    if(ggnWeekStart){


        ggnWeekStart.addEventListener(

            "change",

            autoGGNWeekEndDate

        );


    }





    if(ggnWeekDays){


        ggnWeekDays.addEventListener(

            "input",

            autoGGNWeekEndDate

        );


    }



}








/* =====================================================
   END OF PART 4/5


   NEXT:

   PART 5/5

   - Final Initialization
   - DOM Ready
   - Safety Check
   - Final Integration

===================================================== */
/* =====================================================
   KALKULATOR AKTA KERJA 1955
   SCRIPT.JS
   PROFESSIONAL CLEAN VERSION

   PART 5/5

   SECTION:
   - Reset Helper
   - Safety Engine
   - Initialization
   - Final Integration

===================================================== */






/* =====================================================
   SECTION 24
   GLOBAL RESET HELPER


   Fungsi:
   Reset semua jenis input
   dan output dengan selamat


===================================================== */


function resetCalculatorFields(ids){



    ids.forEach(

        id=>{


            let element =

            getElement(id);



            if(element){


                element.value = "";


            }


        }

    );


}









/* =====================================================
   SECTION 25
   SAFETY ENGINE


   Memastikan function hanya
   berjalan jika HTML element
   berkaitan wujud


===================================================== */


function elementExists(id){


    return (

        getElement(id)

        !==

        null

    );


}





function runIfExists(

    functionName

){



    if(

        typeof window[functionName]

        ===

        "function"

    ){



        window[functionName]();


    }


}









/* =====================================================
   SECTION 26
   AUTO FORMAT INPUT SALARY


   Bila user keluar dari input:

   =2500+300


   Jumlah akan kekal
   tetapi formula tidak
   mengganggu calculation


===================================================== */



function setupSalaryInput(){



    Object.values(

        SALARY_FIELDS

    )

    .forEach(

        field=>{



            [

                field.basic,

                field.allowance

            ]

            .forEach(

                id=>{


                    let input =

                    getElement(id);



                    if(input){



                        input.addEventListener(

                            "blur",

                            function(){


                                let value =

                                calculateInput(

                                    this.value

                                );



                                if(

                                    this.value.trim() !== ""

                                ){


                                    this.value =

                                    value;


                                }


                            }

                        );


                    }


                }

            );


        }

    );


}









/* =====================================================
   SECTION 27
   AUTO RESTORE ORP


   Digunakan oleh:

   - Cuti Tahunan
   - Cuti Sakit


===================================================== */


function restoreORP(){



    let savedORP =

    localStorage.getItem(

        "ORP"

    );



    return Number(savedORP) || 0;


}









/* =====================================================
   SECTION 28
   INITIALIZATION ENGINE


   Semua setup dimulakan
   di sini


===================================================== */


function initCalculator(){



    console.log(

        "Kalkulator Akta Kerja 1955 Loaded"

    );




    /*
       Auto update:

       Gaji Pokok
       +
       Elaun
       =
       Jumlah Upah

    */


    setupSalaryAutoUpdate();






    /*
       Auto tarikh:

       GGN Hari

       GGN Minggu

    */


    setupDateAutoCalculation();






    /*
       Formula input:

       =2500+300

    */


    setupSalaryInput();



}









/* =====================================================
   SECTION 29
   DOM READY


===================================================== */



document.addEventListener(

    "DOMContentLoaded",

    initCalculator

);








/* =====================================================
   SECTION 30
   GLOBAL ERROR PROTECTION


   Elak satu calculator
   rosakkan semua calculator lain


===================================================== */



window.onerror = function(

    message,

    source,

    lineno,

    colno,

    error

){



    console.warn(

        "Calculator Error:",

        message

    );



    return false;


};








/* =====================================================
   SECTION 31
   EXPORT GLOBAL FUNCTION


   Digunakan oleh HTML:

   onclick="calculateORP()"


===================================================== */



window.calculateORP = calculateORP;


window.resetORP = resetORP;



window.calculateOTBiasa = calculateOTBiasa;


window.resetOTBiasa = resetOTBiasa;



window.calculateOTRH = calculateOTRH;


window.resetOTRH = resetOTRH;



window.calculateHariRehat = calculateHariRehat;


window.resetHariRehat = resetHariRehat;



window.calculateHariRehatLebih = calculateHariRehatLebih;


window.resetHariRehatLebih = resetHariRehatLebih;



window.calculatePH = calculatePH;


window.resetPH = resetPH;



window.calculateOTPH = calculateOTPH;


window.resetOTPH = resetOTPH;




window.calculateGGNMonth = calculateGGNMonth;


window.calculateGGNWeek = calculateGGNWeek;


window.calculateGGNDay = calculateGGNDay;



window.resetGGN = resetGGN;


window.resetGGNWeek = resetGGNWeek;


window.resetGGNDay = resetGGNDay;





window.calculateSection18A = calculateSection18A;


window.resetSeksyen18A = resetSeksyen18A;




window.calculateCutiTahunan = calculateCutiTahunan;


window.resetCutiTahunan = resetCutiTahunan;



window.calculateCutiSakit = calculateCutiSakit;


window.resetCutiSakit = resetCutiSakit;








/* =====================================================
   END OF SCRIPT.JS

   VERSION:

   PROFESSIONAL CLEAN VERSION

   Compatible:

   HTML:
   - Kalkulator Akta Kerja 1955

   CSS:
   - Calculator Card Layout
   - Result Row Grid System


===================================================== */

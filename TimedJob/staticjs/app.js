/*
        Date 
        new Date()
        new Date(date string)

        new Date(year,month)
        new Date(year,month,day)
        new Date(year,month,day,hours)
        new Date(year,month,day,hours,minutes)
        new Date(year,month,day,hours,minutes,seconds)
        new Date(year,month,day,hours,minutes,seconds,ms)

        new Date(milliseconds)

        */
class SessionInfo {
    constructor(nom, prenom, nomOrga, heureH) {
        this.nomUser = nom;
        this.prenomUser = prenom;
        this.organisation = nomOrga;
        this.heureHebdo = heureH;
    }

    save() {
        let myJsonOBJ = {
            nom: this.nomUser,
            prenom: this.prenomUser,
            organisation: this.organisation,
            heureH: this.heureHebdo
        }
        localStorage.setItem("session", JSON.stringify(myJsonOBJ));
    }

    setSession(nom, prenom, nomOrga, heureH) {
        this.nomUser = nom;
        this.prenomUser = prenom;
        this.organisation = nomOrga;
        this.heureHebdo = heureH;
    }

    static delete() {
        localStorage.removeItem("session");
        localStorage.removeItem("JP")
    }

    static getSession() {
        //renvoie la session enregistré sur le "session" key
        //renvoie 0 si pas de session enregistre
        if (localStorage.getItem("session")) {
            let jsonStr = localStorage.getItem("session");
            let json = JSON.parse(jsonStr);
            return new SessionInfo(json.nom, json.prenom, json.organisation, json.heureH);
        } else {
            return new SessionInfo("", "", "", "");
        }
    }
}

class JourneePresence {
    constructor(Annee, Mois, Jour) {//Heure d'arrivée, de pause, fin de pause et de départ
        this.date = new Date(Annee, Mois, Jour, 0, 0, 0, 0);
        this.heureArrivee = this.date;
        this.heurePause = this.date;
        this.heureFinPause = this.date;
        this.heureDepart = this.date;
    }

    static ofDay() {//date du jour 
        const laDateJour = new Date();
        return new this(laDateJour.getFullYear(), laDateJour.getMonth(), laDateJour.getDate());
    }

    static ofSave(strDate, strArrivee, strPause, strFinPause, strDepart) {
        const laDateJour = new Date(strDate);
        let jp = new this(laDateJour.getFullYear(), laDateJour.getMonth(), laDateJour.getDate());

        var tempDate = new Date(strArrivee);
        jp.setHeureArrivee(tempDate.getHours(), tempDate.getMinutes());

        tempDate = new Date(strPause);
        jp.setHeurePause(tempDate.getHours(), tempDate.getMinutes());

        tempDate = new Date(strFinPause);
        jp.setHeureFinPause(tempDate.getHours(), tempDate.getMinutes());

        tempDate = new Date(strDepart);
        jp.setHeureDepart(tempDate.getHours(), tempDate.getMinutes());
        return jp;
    }

    getHeureArr() {
        return { heure: this.heureArrivee.getHours(), minutes: this.heureArrivee.getMinutes() };
    }

    getHeurePau() {
        return { heure: this.heurePause.getHours(), minutes: this.heurePause.getMinutes() };
    }

    getHeureFpa() {
        return { heure: this.heureFinPause.getHours(), minutes: this.heureFinPause.getMinutes() };
    }

    getHeureDep() {
        return { heure: this.heureDepart.getHours(), minutes: this.heureDepart.getMinutes() };
    }

    setHeureArrivee(heures, minutes) {
        this.heureArrivee = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), heures, minutes, 0, 0);
    }

    setHeurePause(heures, minutes) {
        this.heurePause = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), heures, minutes, 0, 0);
    }

    setHeureFinPause(heures, minutes) {
        this.heureFinPause = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), heures, minutes, 0, 0);
    }

    setHeureDepart(heures, minutes) {
        this.heureDepart = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), heures, minutes, 0, 0);
    }

    getHeureTotaleJournee() {
        //miniteur en heure => heure/60
        let ha = this.heureArrivee.getHours() + this.heureArrivee.getMinutes() / 60;//heure d'arrivé
        let hp = this.heurePause.getHours() + this.heurePause.getMinutes() / 60;//heure pause
        let hfp = this.heureFinPause.getHours() + this.heureFinPause.getMinutes() / 60;//heure fin pause
        let hd = this.heureDepart.getHours() + this.heureDepart.getMinutes() / 60;//heure depart
        if (ha != 0 && hd != 0) {
            if (hp != 0) {
                if (hfp == 0) {
                    return Number.parseFloat((hp - ha).toFixed(2));
                } else {
                    return Number.parseFloat(((hp - ha) + (hd - hfp)).toFixed(2));
                }
            } else {
                return Number.parseFloat((hd - ha).toFixed(2));
            }
        } else if (ha != 0 && hp != 0) {
            return Number.parseFloat((hp - ha).toFixed(2));
        } else { return 0; }
    }

    getMapObject() {
        return {
            date: this.date.toISOString(), //La date de la journée enregistre
            heurea: this.heureArrivee.toISOString(),//la date d'arrivée (heure)s
            heurep: this.heurePause.toISOString(),//la date de prise de la pause (heure)
            heurefp: this.heureFinPause.toISOString(),//la date de fin de la pause (heure)
            heured: this.heureDepart.toISOString()//la date depart (heure)
        };
    }

    compareDate(otherDate) {
        if (this.date.getFullYear() == otherDate.getFullYear() && this.date.getMonth() == otherDate.getMonth() && this.date.getDay() == otherDate.getDay()) {
            return true;
        } else {
            return false;
        }
    }

    static getAllJournees() {
        if (localStorage.getItem("JP")) {
            let jsonStr = localStorage.getItem("JP");
            let JsonOBJ = JSON.parse(jsonStr);
            let list = [];
            JsonOBJ.forEach(el => {
                list.push(JourneePresence.ofSave(el.date, el.heurea, el.heurep, el.heurefp, el.heured));
            });
            return list;
        } else {
            return [];
        }
    }

    static saveAllJournees(listJournees) {//list de toute les journées (liste d'objet JourneePresence)
        let list = [];
        listJournees.forEach(el => {
            list.push(el.getMapObject());
        });
        localStorage.setItem("JP", JSON.stringify(list));
    }
}

class App {

    constructor() {
        this.session = SessionInfo.getSession();
        this.journees = JourneePresence.getAllJournees();
        this.menu1 = false;
        this.menu2 = false;
        this.menu3 = false;
        if (this.session.nomUser != "") {
            this.setVisible(2);
            this.update(2);
        } else {
            this.setVisible(1);
        }

    }

    alimenteDate(Date, lib) {
        document.getElementById("date").innerHTML = Date.getDate().toString().padStart(2, '0') + "/" + (Date.getMonth() + 1).toString().padStart(2, '0') + "/" + Date.getFullYear() + " - " + lib;
    }

    alimenteHeureJour(val) {
        document.getElementById("libHeureJour").innerHTML = "Nombre d'heures éffectué ce jour : " + val;
    }

    update(menuToUpdate, option = 0) {
        switch (menuToUpdate) {
            case 1:

                break;
            case 2:
                //On cherche le menu a éditer
                //1 on cherche le menu qui n'a pa été terminé
                this.selectedJournee = null; //Si reste null, on est en mode création.
                let today = new Date();
                this.alimenteDate(today, "New");
                this.journees.forEach(el => {
                    let elDep = el.getHeureDep()
                    let dep = elDep.heure + elDep.minutes / 60;
                    if ((el.getHeureTotaleJournee() == 0 || dep == 0) && this.selectedJournee == null) {
                        this.selectedJournee = el;
                        //Allimenter le menu edition de journee
                        this.alimenteDate(el.date, "Old");

                        let harr = el.getHeureArr();
                        document.getElementById("ejpHARR").value = harr.heure;
                        document.getElementById("ejpMARR").value = harr.minutes;

                        let hpau = el.getHeurePau();
                        document.getElementById("ejpHPAU").value = hpau.heure;
                        document.getElementById("ejpMPAU").value = hpau.minutes;

                        let hfpa = el.getHeureFpa();
                        document.getElementById("ejpHFPA").value = hfpa.heure;
                        document.getElementById("ejpMFPA").value = hfpa.minutes;

                        let hdep = el.getHeureDep();
                        document.getElementById("ejpHDEP").value = hdep.heure;
                        document.getElementById("ejpMDEP").value = hdep.minutes;
                    }
                });
                if (this.selectedJournee == null) {
                    this.journees.forEach(el => {
                        if (el.compareDate(today)) {
                            this.selectedJournee = el;
                            //Allimenter le menu edition de journee
                            this.alimenteDate(el.date, 'Old');

                            let harr = el.getHeureArr();
                            document.getElementById("ejpHARR").value = harr.heure;
                            document.getElementById("ejpMARR").value = harr.minutes;

                            let hpau = el.getHeurePau();
                            document.getElementById("ejpHPAU").value = hpau.heure;
                            document.getElementById("ejpMPAU").value = hpau.minutes;

                            let hfpa = el.getHeureFpa();
                            document.getElementById("ejpHFPA").value = hfpa.heure;
                            document.getElementById("ejpMFPA").value = hfpa.minutes;

                            let hdep = el.getHeureDep();
                            document.getElementById("ejpHDEP").value = hdep.heure;
                            document.getElementById("ejpMDEP").value = hdep.minutes;
                        }
                    });
                }
                if (this.selectedJournee != null) {
                    let val = this.selectedJournee.getHeureTotaleJournee();
                    if (val != 0) {
                        this.alimenteHeureJour(val);
                    }
                } else {
                    document.getElementById("ejpHARR").value = today.getHours();
                    document.getElementById("ejpMARR").value = today.getMinutes();
                }

                break;
            case 3:

                break;
        }
    }

    err(msg) {
        document.getElementById("err").innerHTML = msg;
    }

    errReset() {
        this.err("");
    }

    setVisible(menuToSee, option = 0) {
        switch (menuToSee) {
            case 1:
                this.menu1 = true;
                this.menu2 = false;
                this.menu3 = false;
                document.getElementById("EditSessionMenu").style.display = "block";
                document.getElementById("EditJourneePresence").style.display = "none";
                document.getElementById("StatististicsMenu").style.display = "none";
                break;
            case 2:
                this.menu1 = false;
                this.menu2 = true;
                this.menu3 = false;
                document.getElementById("EditSessionMenu").style.display = "none";
                document.getElementById("EditJourneePresence").style.display = "block";
                document.getElementById("StatististicsMenu").style.display = "none";
                break;
            case 3:
                this.menu1 = false;
                this.menu2 = false;
                this.menu3 = true;
                document.getElementById("EditSessionMenu").style.display = "none";
                document.getElementById("EditJourneePresence").style.display = "none";
                document.getElementById("StatististicsMenu").style.display = "block";
                break;
        }
    }

    save() {
        this.session.save();
        JourneePresence.saveAllJournees(this.journees);
    }

    suprDmd() {
        var x = confirm('Êtes-vous sûr de vouloir supprimer les données ?\n Les données seront irrécupérable.');
        if (x) {
            SessionInfo.delete();
        };
    }

    exit() {
        var x = confirm('Êtes-vous sûr de vouloir quitter ?\n Les données seront enregistrer.');
        if (x) {
            this.save()
            window.close()
        };
    }

    openSessionMenu() {
        document.getElementById('esmNom').value = this.session.nomUser;
        document.getElementById('esmPrenom').value = this.session.prenomUser;
        document.getElementById('esmOrga').value = this.session.organisation;
        document.getElementById('esmHebdo').value = this.session.heureHebdo;
        this.setVisible(1);
    }

    valideSessionEdit() {
        if (this.menu1) {
            let nom = document.getElementById('esmNom').value;
            let prenom = document.getElementById('esmPrenom').value;
            let orga = document.getElementById('esmOrga').value;
            let heureHebdo = document.getElementById('esmHebdo').value;
            if (nom != "" && prenom != "" && orga != "" && heureHebdo != "") {
                this.session.setSession(nom, prenom, orga, Number.parseFloat(heureHebdo));
                this.session.save();
                this.update(2);
                this.setVisible(2);
            }
        }
    }

    openJourneeMenu() {
        this.update(2);
        this.setVisible(2);
    }

    openStatisticMenu() {
        this.update(3, 0);
        this.setVisible(3, 0);
    }

    controlJourneeInput(heureArr, heurePau, heureFpa, heureDep) {
        let ha = heureArr.heure + heureArr.minute / 60;//heure d'arrivé
        let hp = heurePau.heure + heurePau.minute / 60;//heure pause
        let hfp = heureFpa.heure + heureFpa.minute / 60;//heure fin pause
        let hd = heureDep.heure + heureDep.minute / 60;//heure depart
        return (ha <= hp && hp <= hfp && hfp <= hd) || ha == 0 || hp == 0 || hfp == 0 || hd == 0;
    }

    show(statsId) {
        switch (statsId) {
            case 1:
                window.open('./byDays.html', '_blank');
                break;
            case 2:
                window.open('./byWeek.html', '_blank');
                break;
            case 3:
                window.open('./byMonth.html', '_blank');
                break;
        }
    }

    majAuto(){
        if(this.selectedJournee != null){
            let today = new Date();
            let hArr = document.getElementById("ejpHARR");
            let mArr = document.getElementById("ejpMARR");

            let hPau = document.getElementById("ejpHPAU");
            let mPau = document.getElementById("ejpMPAU");

            let hFpa = document.getElementById("ejpHFPA");
            let mFpa = document.getElementById("ejpMFPA");

            let hDep = document.getElementById("ejpHDEP");
            let mDep = document.getElementById("ejpMDEP");
            let heureArr = { heure: Number.parseFloat(hArr.value), minute: Number.parseFloat(mArr.value) };
            let heurePau = { heure: Number.parseFloat(hPau.value), minute: Number.parseFloat(mPau.value) };
            let heureFpa = { heure: Number.parseFloat(hFpa.value), minute: Number.parseFloat(mFpa.value) };
            let heureDep = { heure: Number.parseFloat(hDep.value), minute: Number.parseFloat(mDep.value) };
            if(heureArr.heure == 0 && heureArr.minute == 0){
                hArr.value = today.getHours();
                mArr.value = today.getMinutes();
                this.valideJourneeEdit();
            }else if(heurePau.heure == 0 && heurePau.minute == 0){
                hPau.value = today.getHours();
                mPau.value = today.getMinutes();
                this.valideJourneeEdit();
            }else if(heureFpa.heure == 0 && heureFpa.minute == 0){
                hFpa.value = today.getHours();
                mFpa.value = today.getMinutes();
                this.valideJourneeEdit();
            }else if(heureDep.heure == 0 && heureDep.minute == 0){
                hDep.value = today.getHours();
                mDep.value = today.getMinutes();
                this.valideJourneeEdit();
            }
            location.reload();
        }
    }

    valideJourneeSel(){
        let heureArr = { heure: Number.parseFloat(document.getElementById("ejpHARRs").value), minute: Number.parseFloat(document.getElementById("ejpMARRs").value) };
        let heurePau = { heure: Number.parseFloat(document.getElementById("ejpHPAUs").value), minute: Number.parseFloat(document.getElementById("ejpMPAUs").value) };
        let heureFpa = { heure: Number.parseFloat(document.getElementById("ejpHFPAs").value), minute: Number.parseFloat(document.getElementById("ejpMFPAs").value) };
        let heureDep = { heure: Number.parseFloat(document.getElementById("ejpHDEPs").value), minute: Number.parseFloat(document.getElementById("ejpMDEPs").value) };
        let verif = true;
        verif = heureArr.heure <= 23 && heureArr.heure >= 0 && heureArr.minute <= 59 && heureArr.minute >= 0 && verif;
        verif = heurePau.heure <= 23 && heurePau.heure >= 0 && heurePau.minute <= 59 && heurePau.minute >= 0 && verif;
        verif = heureFpa.heure <= 23 && heureFpa.heure >= 0 && heureFpa.minute <= 59 && heureFpa.minute >= 0 && verif;
        verif = heureDep.heure <= 23 && heureDep.heure >= 0 && heureDep.minute <= 59 && heureDep.minute >= 0 && verif;
        let dateStr = document.getElementById('dateSel').value;
        let annees = Number.parseInt(dateStr.substring(0,4));
        let mois = Number.parseInt(dateStr.substring(5,7)) - 1;
        let jours = Number.parseInt(dateStr.substring(8,10));
        let edit = false;
        if(dateStr != ''){
            let date = new Date(annees,mois,jours);
            verif = verif && date != new Date();
            console.log(dateStr);
            if(verif && this.controlJourneeInput(heureArr, heurePau, heureFpa, heureDep)){
                //Si existe modification    
                
                for (let i = 0; i < this.journees.length; i++) {
                    if (this.journees[i].compareDate(date)) {
                        this.journees[i].setHeureArrivee(heureArr.heure, heureArr.minute);
                        this.journees[i].setHeurePause(heurePau.heure, heurePau.minute);
                        this.journees[i].setHeureFinPause(heureFpa.heure, heureFpa.minute);
                        this.journees[i].setHeureDepart(heureDep.heure, heureDep.minute);
                        edit = true;
                    }
                }
                //Si non creation
                if(!edit){
                    let jour = new JourneePresence(date.getFullYear(),date.getMonth(),date.getDate());
                    jour.setHeureArrivee(heureArr.heure, heureArr.minute);
                    jour.setHeurePause(heurePau.heure, heurePau.minute);
                    jour.setHeureFinPause(heureFpa.heure, heureFpa.minute);
                    jour.setHeureDepart(heureDep.heure, heureDep.minute);
                    edit = true;
                }
                
            }
        }

        if(edit){
            JourneePresence.saveAllJournees(this.journees);
        }
        location.reload();
    }

    valideJourneeEdit() {
        this.errReset();
        if (this.menu2) {
            let heureArr = { heure: Number.parseFloat(document.getElementById("ejpHARR").value), minute: Number.parseFloat(document.getElementById("ejpMARR").value) };
            let heurePau = { heure: Number.parseFloat(document.getElementById("ejpHPAU").value), minute: Number.parseFloat(document.getElementById("ejpMPAU").value) };
            let heureFpa = { heure: Number.parseFloat(document.getElementById("ejpHFPA").value), minute: Number.parseFloat(document.getElementById("ejpMFPA").value) };
            let heureDep = { heure: Number.parseFloat(document.getElementById("ejpHDEP").value), minute: Number.parseFloat(document.getElementById("ejpMDEP").value) };
            let verif = true;
            verif = heureArr.heure <= 23 && heureArr.heure >= 0 && heureArr.minute <= 59 && heureArr.minute >= 0 && verif;
            verif = heurePau.heure <= 23 && heurePau.heure >= 0 && heurePau.minute <= 59 && heurePau.minute >= 0 && verif;
            verif = heureFpa.heure <= 23 && heureFpa.heure >= 0 && heureFpa.minute <= 59 && heureFpa.minute >= 0 && verif;
            verif = heureDep.heure <= 23 && heureDep.heure >= 0 && heureDep.minute <= 59 && heureDep.minute >= 0 && verif;
            if (this.selectedJournee == null && this.controlJourneeInput(heureArr, heurePau, heureFpa, heureDep) && verif) {
                let jp = JourneePresence.ofDay();
                jp.setHeureArrivee(heureArr.heure, heureArr.minute);
                jp.setHeurePause(heurePau.heure, heurePau.minute);
                jp.setHeureFinPause(heureFpa.heure, heureFpa.minute);
                jp.setHeureDepart(heureDep.heure, heureDep.minute);
                this.journees.push(jp);
                JourneePresence.saveAllJournees(this.journees);
                this.update(2);
                location.reload();
            } else if (this.controlJourneeInput(heureArr, heurePau, heureFpa, heureDep) && verif) {
                for (let i = 0; i < this.journees.length; i++) {
                    if (this.journees[i].compareDate(this.selectedJournee.date)) {
                        this.journees[i].setHeureArrivee(heureArr.heure, heureArr.minute);
                        this.journees[i].setHeurePause(heurePau.heure, heurePau.minute);
                        this.journees[i].setHeureFinPause(heureFpa.heure, heureFpa.minute);
                        this.journees[i].setHeureDepart(heureDep.heure, heureDep.minute);
                    }
                }
                JourneePresence.saveAllJournees(this.journees);
                this.update(2);
                location.reload();
            } else {
                if (verif) {
                    this.err("Votre saisie est incorrecte, verifiez la chronologie de votre journée.");
                } else {
                    this.err("Votre saisie est incorrecte, une heure c'est entre 0 et 23, les minutes entre 0 et 59");
                }

            }
        }
    }
}
 // Client Script
	var snFee = parseFloat(g_form.getValue('sn_fee'));


   var check = new GlideAjax('GetHCLicensingCV');
   check.addParam('sysparm_name', 'hcResult');
   check.addParam('sysparm_comp', reg);
   check.addParam('sysparm_sn', snFee);
   check.getXML(analyzeResponse);

   function analyzeResponse(response){
   var answer = response.responseXML.documentElement.getAttribute("answer");
   alert(answer);
	}

//script include
	hcResult: function(){

	var lice=     this.getParameter('sysparm_comp');
	var por = this.getParameter('sysparm_sn');
	lice = lice.match(/\d+/);
	return lice;

	}
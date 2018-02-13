        var urlvalue;
		function dashboardcheck(e) {
			var dbvalue = 0;
			$.ajax({
			async: false,
			dataType : 'json',
			url: "https://sharat543.github.io/POCdashboards.json",
			type : 'GET',
			success: function(data) {
				for (var e1 = 0; e1 < data['dashboards'].length; e1++) {
				if (e === data['dashboards'][e1]['name'])
				{dbvalue = dbvalue + 1; urlvalue = data['dashboards'][e1]['site'];}
				else { dbvalue = dbvalue + 0; }
				}
			}});
			return dbvalue;
		}
		
		function fieldcheck(f1,f2) {
			var fldassign = 0;
			$.ajax({
			async: false,
			dataType : 'json',
			url: "https://sharat543.github.io/POCfields.json",
			type : 'GET',
			success: function(data) {
					for (var f3 = 0; f3 < data['fields'].length; f3++) {
					if (f1 === data['fields'][f3]['db'] && f2 === data['fields'][f3]['name'])
					{fldassign = fldassign + 1;}
					else if (f2 === 0)
					{ fldassign = fldassign + 1; }
					else { fldassign = fldassign + 0; }
					}
			}});
			
			return fldassign;
		}      
	//added by Sarat
		var viz,url,sheet,workbook,sharray;
		if (viz) { // If a viz object exists, delete it.
                viz.dispose();
            }
		var counter=0;
		function initViz(d,f,v,u)
		{
			if (viz) { viz.dispose(); }
			viz=0;
            var containerDiv = document.getElementById("vizContainer"),
            options = {
                   	hideTabs: true,
					onFirstInteractive: function () {
									workbook = viz.getWorkbook();
									activeSheet = workbook.getActiveSheet();
									if (activeSheet.getSheetType() === 'dashboard')
									{
									sharray = activeSheet.getWorksheets();
									}
									else
									{
									sharray = null;
									}
									selectfilter(f,v);
									}	
               	      };
			 
			if ( f === 0 )
			{
			voiceoutput("Opening "+d+" dashboard",0);
			}
			else
			{
			voiceoutput("Applying "+v+" filter to "+d+" dashboard",0);
			}
			url = u;
            $('.speak-home').hide();
            
			viz = new tableau.Viz(containerDiv, url, options);

        }
		
		//added by Sarat
		function selectfilter(field,value) {
			
			if ( field == 0 && value == 0 )
			{
				viz.revertAllAsync();
				$(speakAgainsmall).show();
			}
			else
			{	
				var derivedvalue = valueCase(value);
				var derivedfield = chooseSelectFilter(field);
				//alert(derivedfield+derivedvalue);
				if (derivedfield === "select") 
				{ 
					if ( activeSheet.getSheetType() === 'dashboard' )
					{
					for (var i=0; i < sharray.length; i++) { sharray[i].selectMarksAsync(field, derivedvalue, tableau.SelectionUpdateType.REPLACE); } 
					}
					else
					{
					activeSheet.selectMarksAsync(field, derivedvalue, tableau.SelectionUpdateType.REPLACE);
					}
				}
				else if (derivedfield === "filter")
				{
					if ( activeSheet.getSheetType() === 'dashboard' )
					{
					for (var j=0; j < sharray.length; j++) { sharray[j].applyFilterAsync(field, derivedvalue, tableau.FilterUpdateType.REPLACE); }
					}
					else
					{
					activeSheet.applyFilterAsync(field, derivedvalue, tableau.FilterUpdateType.REPLACE);
					}					
				}	
				
				$(speakAgainsmall).show();
			}

				if ( db === "sales distribution")
				{
				voiceoutput("Drug Channel continues to be the leading contributor in your overall sales of $20 Million. The trend on other channels is also inline with the previous periods",2);
				}
				else if ( db === "sales")
				{
				voiceoutput("Product 1 occupies fourth position in terms of market share. and sales have decreased by 0.1 million compared to the previous period",2);
				}
				else if ( db === "incidents" || db === "incident")
				{
				voiceoutput("For the month of Aug, there is an increase in medium and low priority incidents while high priority incidents have witnessed a decrease compared to last month",2);
				}
				else if ( db === "executive")
				{
				voiceoutput("Welcome to the executive dashboard. The application availability is 100% and critical incidents caused by change are 0",2);
				}
				else if ( db === "incident resolution")
				{
				voiceoutput("The average resolution time is 43 hours. Out of the total 29198 incidents, 1604 did not meet SLA and 27,594 of them have met SLA",2);
				}
				else if ( db === "tickets")
				{
				voiceoutput("There are 52 tickets aging greater than 60 days",2);
				}
				else if ( db === "variance")
				{
				voiceoutput("The effort variance efficiency is 90% for the selected period",2);
				}
				
		}
		
		//added by Sarat
		function valueCase(a) {
			var jsonvalue;
			$.ajax({
			async: false,
			dataType : 'json',
			url: "https://sharat543.github.io/POCvalues.json",
			type : 'GET',
			success: function(data) {
				for (var c = 0; c < data['values'].length; c++) {
				var jsonvaluelow = data['values'][c]['id'].toLowerCase();
				var valuelow = a.toLowerCase();
				if (jsonvaluelow === valuelow)
				{jsonvalue = data['values'][c]['name'];}
				}
			}});
			return jsonvalue;
		}
		
		function chooseSelectFilter(b) {
			var jsonfield; 
			$.ajax({
			async: false,
			dataType : 'json',
			url: "https://sharat543.github.io/POCfields.json",
			type : 'GET',
			success: function(data) {
				for (var d = 0; d < data['fields'].length; d++) {
				var jsonfieldlow = data['fields'][d]['name'].toLowerCase();
				var fieldlow = b.toLowerCase();
				if (jsonfieldlow === fieldlow)
				{jsonfield = data['fields'][d]['choosetype'];}
				}
			}});
			
			return jsonfield;
		}
        
    
        $("#toggle-first-sidebar").click(function(){
            $(".first-sidebar-content").toggle();
        });
        $("#toggle-second-sidebar").click(function(){
            $(".second-sidebar-content").toggle();
        });

	var dashBoardDetails = {};
		var data;
		var dataGeneric;
		var Analytics = {};
		var reportAttributes;
//code change Mohit : read metrics from JSON file
		function readTextFile(file,callback) {
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", file, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
		}
// code change Mohit : read metrics from JSON file
		function getReportAttributesForDashboard(part) {
            
            readTextFile("https://raw.githubusercontent.com/moawasthi/TableauIntegration/master/Dashboard_ColumnDetails.json", function(text) {
                 data = JSON.parse(text);
                for (var i = 0; i < data.length; i++) {
                if(data[i].Dashboard1.Name == part)
                {
                    dashBoardDetails = {
                        Measures : data[i].Dashboard1.Measures,
                        Dimensions : data[i].Dashboard1.Dimensions,
                        textTemplates :  data[i].Dashboard1.textTemplates,
                    };

                }
       
                else if(data[i].SimpleDashboard.Name == part)
                {
                    dashBoardDetails = {
                        Measures : data[i].SimpleDashboard.Measures,
                        Dimensions : data[i].SimpleDashboard.Dimensions,
                        textTemplates :  data[i].SimpleDashboard.textTemplates
                    };

                }
                }
			});
			readTextFile("https://raw.githubusercontent.com/moawasthi/TableauIntegration/master/Mobile.json", function(text) {
				dataGeneric = JSON.parse(text);
			   for (var i = 0; i < dataGeneric.length; i++) {
				   
				   if(dataGeneric[i].tableaumetrics.dashboard == part)
				   {
					   reportAttributes = {
						   dashboard: dataGeneric[i].tableaumetrics.dashboard,
						   reportUrl: dataGeneric[i].tableaumetrics.reportUrl,
						   sheetName: dataGeneric[i].tableaumetrics.dashboardPart,
						   NLG : dataGeneric[i].tableaumetrics.NLG
					   };
				   }
				   else 
				   {
					   console.log(dataGeneric[i].tableaumetrics.dashboard);
					   console.log(part);
				   }
			   }
			});
		}
// code change Mohit : Summary code 
		function getSummaryData() {
            var loopcounter = 0;
            var finalOutput = [];
            var finalObject;
            var finalObjectArray = [];
            var analysisArray = [];
            var returnObject;
            workbook = viz.getWorkbook(); 
            for( var i=0;i<reportAttributes.sheetName.length;i++) {
            sheet = viz.getWorkbook().getActiveSheet().getWorksheets().get(reportAttributes.sheetName[i]);
                options = {
                    maxRows: 0, // Max rows to return. Use 0 to return all rows
                    ignoreAliases: false,
                    ignoreSelection: true,
                    includeAllColumns: false
                };

            sheet.getSummaryDataAsync(options).then(function(t) {
                table = t;
                var tcol = table.getColumns();
                //the data returned from the tableau API
                var columns = table.getColumns();
                var datafromTableau = table.getData();
                var getIndexAttributes = [];
            var niceData = reduceToObjects(columns, datafromTableau);
            analysisArray.push(niceData);
            loopcounter++;
            if(loopcounter == reportAttributes.sheetName.length )
            {
                AnalyzeJSON(analysisArray);
            }
            });
           }
		}

		function getKPIForMobileDashboard(k,b,measure, dimensions)
        {
       
            if(typeof b[0]["" + measure.Name + ""] === "undefined")
            {
                console.log("Measure  " + measure.Name + " is not defined");
                return;
            }
             if((measure.Name == "SUM(Profit)"))
             {
                max =  b.reduce((max, b) => Math.max(max, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                min = b.reduce((min, b) => Math.min(min, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                for (var i =0;i<b.length;i++)
                {
                    if(k==0)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder1 + ""] = b[i]["" + dimensions.Dimension1 + ""];
                            Analytics["" + measure.PlaceHolder2 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                    if(k==3)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder15 + ""] = b[i]["" + dimensions.Dimension5 + ""];
                            Analytics["" + measure.PlaceHolder16 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                   
                }   
             }

             if((measure.Name == "SUM(Quantity)"))
             {
                max =  b.reduce((max, b) => Math.max(max, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                min = b.reduce((min, b) => Math.min(min, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                for (var i =0;i<b.length;i++)
                {
                    if(k==0)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder3 + ""] = b[i]["" + dimensions.Dimension1 + ""];
                            Analytics["" + measure.PlaceHolder4 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                    if(k==3)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder17 + ""] = b[i]["" + dimensions.Dimension5 + ""];
                            Analytics["" + measure.PlaceHolder18 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                   
                }   
             }
             if((measure.Name == "SUM(Sales)"))
             {
                max =  b.reduce((max, b) => Math.max(max, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                min = b.reduce((min, b) => Math.min(min, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                for (var i =0;i<b.length;i++)
                {
                    if(k==0)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder5 + ""] = b[i]["" + dimensions.Dimension1 + ""];
                            Analytics["" + measure.PlaceHolder6 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                    if(k==3)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder19 + ""] = b[i]["" + dimensions.Dimension5 + ""];
                            Analytics["" + measure.PlaceHolder20 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                   
                }   
             }
             
             if(measure.Name == "Measure Values")
             {
                
                max =  b.reduce((max, b) => Math.max(max, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                min = b.reduce((min, b) => Math.min(min, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                for (var i =0;i<b.length;i++)
                {
                    if(k==1)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder7 + ""] = b[i]["" + measure.Name + ""];
                            Analytics["" + measure.PlaceHolder10 + ""] = b[i]["" + dimensions.Dimension3 + ""];
                            Analytics["" + measure.PlaceHolder22 + ""] = b[i]["" + dimensions.Dimension2 + ""];
                        }
                    }
                    if(k==2)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder11 + ""] = b[i]["" + measure.Name + ""];
                            Analytics["" + measure.PlaceHolder12 + ""] = b[i]["" + dimensions.Dimension4 + ""];
                            Analytics["" + measure.PlaceHolder21 + ""] = b[i]["" + dimensions.Dimension2 + ""];
                        }
                    }
                   
                }  
             }
        }
        function getKPIForSimpleDashboard(k,b,measure, dimensions)
        {
            if(typeof b[0]["" + measure.Name + ""] === "undefined")
            {
                console.log("Measure  " + measure.Name + " is not defined");
                return;
            }
             if((measure.Name == "SUM(Sales)"))
             {
                max =  b.reduce((max, b) => Math.max(max, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                min = b.reduce((min, b) => Math.min(min, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                for (var i =0;i<b.length;i++)
                {
                    if(k==0)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder2 + ""] = b[i]["" + dimensions.Dimension1 + ""];
                            Analytics["" + measure.PlaceHolder1 + ""] = b[i]["" + measure.Name + ""];
                        }
                    } 
                }   
             }

             if((measure.Name == "AVG(Discount)"))
             {
                max =  b.reduce((max, b) => Math.max(max, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                min = b.reduce((min, b) => Math.min(min, b["" + measure.Name + ""].replace("$","").replace(",","")), b[0]["" + measure.Name + ""].replace("$","").replace(",",""));
                for (var i =0;i<b.length;i++)
                {
                    if(k==0)
                    {
                        if(b[i]["" + measure.Name + ""].replace("$","").replace(",","") == max)
                        {
                            Analytics["" + measure.PlaceHolder4 + ""] = b[i]["" + dimensions.Dimension1 + ""];
                            Analytics["" + measure.PlaceHolder3 + ""] = b[i]["" + measure.Name + ""];
                        }
                    }
                   
                }   
             }
        }

        function getKPI(k,b,measure, dimensions, dashboard) {
            var min;
            var max;
            if(typeof measure === 'undefined')
            {
                return;
            }
            if(dashboard == "mobile")
            {
                getKPIForMobileDashboard(k,b,measure, dimensions);
            }
            else if (dashboard == "SimpleDashboard")
            {
                getKPIForSimpleDashboard(k,b,measure, dimensions);
            }
            else
            {
                Analytics = {};
            }
        }

           function getPlaceHolders(dashBoardDetails, analysisArray)
           {
               var textToReturn;
                for(var k=0;k<analysisArray.length;k++)
                    {
                       try{
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['SUM(Profit)'], dashBoardDetails.Dimensions, reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['SUM(Quantity)'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['SUM(Sales)'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['MeasureValuesByOrderDate'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['MeasureValuesByCategory'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['SUM(Profit)SubCategory'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['SUM(Quantity)SubCategory'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['SUM(Sales)SubCategory'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                             getKPI(k,analysisArray[k], dashBoardDetails.Measures['AVG(Discount)'], dashBoardDetails.Dimensions,reportAttributes.dashboard);
                           
                       } 
                       catch (e) {
                            Analytics.Error = 'Measure Unknown';
                        }
                       
                    }
           }

           function getNaturalLanguage(Analytics, reportAttributes)
           {
            var map = reportAttributes.NLG.map;
            var str = reportAttributes.NLG.template.NLGTemplate;
            var textToReturnArray = [];
            if(reportAttributes.dashboard == "mobile")
            {
                if(Analytics.HighestProfitRegion == Analytics.HighestSalesRegion && Analytics.HighestProfitRegion == Analytics.HighestQuantityRegion )
                {
                   textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateSameRegion,map));
                   textToReturnArray.push(replaceAll(str, dashBoardDetails.textTemplates.textTemplateCategory,map));
                   textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateOrderDate,map));
                   textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateSubCategory,map));
                   
                }
                else
                {
                    textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateDifferentRegion,map));
                    textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateCategory,map));
                    textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateOrderDate,map));
                    textToReturnArray.push(replaceAll(str,dashBoardDetails.textTemplates.textTemplateSubCategory,map));

                   
                }
            }
            
            if(reportAttributes.dashboard == "SimpleDashboard")
            {
                textToReturn = dashBoardDetails.textTemplates.textTemplateSummary;
                textToReturn = replaceAll(str, textToReturn, map);
            }
            console.log(textToReturnArray);
            return textToReturnArray;
           }
           function replaceAll(searchText, originalData, mapObj){
                var re = new RegExp(searchText,"gi");
                return originalData.replace(re, function(matched){
                    return eval(mapObj[matched]);
                });
            }    

           function AnalyzeJSON(analysisArray)
           {
            var g = [];
            getPlaceHolders(dashBoardDetails, analysisArray );
            g = getNaturalLanguage(Analytics, reportAttributes);
            console.log(g);
            for(var i =0;i<g.length;i++)
            {
                console.log(g[i])
                voiceoutput(g[i]);
            }
       
            //return g;
           }
        function reduceToObjects(cols,data) {
          var fieldNameMap = $.map(cols, function(col) { return col.$0.$1; });                       
          var dataToReturn = $.map(data, function(d) {
            return d.reduce(function(memo, value, idx) {
                memo[fieldNameMap[idx]] = value.formattedValue; return memo;
                }, {});
            });
          return dataToReturn;
        }
/**
 * This is the Jquery file for the pos.jsp page
 */
if(Cookies.get('usertype')!=1) {
	//redirect to home page
	window.location.replace('home');
}
$(function() {
	/**
	 * Start of knockout.js
	 * 
	 */
	function Area(area) {
	    this.areaId = ko.observable(area.areaId);
	    this.areaName = ko.observable(area.areaName);
	}
	
	function Store(store) {
	    this.storeId = ko.observable(store.storeId);
	    this.area = ko.observable(store.area.areaName);
	    this.area_id = ko.observable(store.area.areaId);
	    this.branchName = ko.observable(store.branchName);
	    this.address = ko.observable(store.address);
	    this.coordinates = ko.observable(store.coordinates);
	}
	
	function Payment(payment) {
		this.pPaymentType = ko.observable(payment.paymentType);
		this.pAmount = ko.observable(payment.amount);
	}
	
	function Receipt(receipt) {
		this.amountDue = ko.observable(receipt.amountDue);
		this.timestamp = ko.observable(receipt.timestamp);
	}
	
	function ReportViewModel() {
		var self = this;
		
		//used in the list
		self.stores = ko.observableArray([]);
		self.storesCopy = ko.observableArray([]);
		self.areas = ko.observableArray([]);
		
		//used in selects
		self.areaid = ko.observableArray();
		self.storeid = ko.observableArray();
		
		//used in charts
		self.transactionCount = ko.observable(0);
		self.totalSales = ko.observable(0);
		self.payments = ko.observableArray([]);
		self.paymentSummary = ko.observableArray([]);
		self.receipts = ko.observableArray([]);
		
		//global variables for use in high charts
		self.currentAreaId = ko.observable(0);
		self.currentStoreId = ko.observable(0);
		
		//used in cookies
		self.loggedInUser = ko.observable(Cookies.get('username'));
		self.loggedInUsertype = ko.observable(Cookies.get('usertype'));
		self.loggedInUserStoreId = ko.observable(Cookies.get('userStoreId'));
		
		//get the list of stores on first load from DB
	    $.getJSON("get-stores", function(allData) {
	        var mappedItems = $.map(allData, function(store) { return new Store(store); });
	        //fill stores array
	        self.stores(mappedItems);
	        //have a copy
	        self.storesCopy(self.stores.slice());
	        
	    });
	   
	    //initialize datetimepickers
	    var datepicker1 = $('#datetimepicker1').datetimepicker({
            format: 'YYYY-MM-DD',
            maxDate: new Date() 
        });
	    var datepicker2 = $('#datetimepicker2').datetimepicker({
            format: 'YYYY-MM-DD',
            maxDate: new Date() 
        });
	    
	    //dates
		self.dateFrom = ko.observable($('#datetimepicker1').data('date'));
		self.dateTo = ko.observable($('#datetimepicker2').data('date'));
		
	    datepicker1.on('dp.change', function (e) {
	        self.dateFrom($('#datetimepicker1').data('date'));
	    });
	    
	    datepicker2.on('dp.change', function (e) {
	    	self.dateTo($('#datetimepicker2').data('date'));
	    });
	      
	    //get the list of areas on first load from DB
	    $.getJSON("get-areas", function(allData) {
	    	var mappedItems = $.map(allData, function(area) { return new Area(area); });
	        //assign to areas
	        self.areas(mappedItems);
	    }); 		

		self.getTotalSales = function(receipts) {
			//set to 0
			self.totalSales(0);
			var total = 0;
			for(var i = 0; i<receipts.length; i++) {
				var saleTotal = receipts[i].amountDue;
				total += saleTotal;
			}
			self.totalSales(total);
			return;
		};
		
		self.displayMoney = function(totalSales) { 
			var money = totalSales.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			var moneyArray = money.split(".");
			if(moneyArray.length==1) {
				money += ".00";
			} else {
				if(moneyArray[1].length==1) {
					moneyArray[1] += "0";
					money = moneyArray[0] + "." + moneyArray[1];
				} else {
					money = moneyArray[0] + "." + moneyArray[1];
				}
			}
			return self.totalSales(money);
			
			

		};
		
		//run reports
		self.getReports = function() {
			self.getAllReports();
		};
		
		self.getTopSellingByQuantity = function() {
			var url = "getTopSellingByQuantity";
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.areaid(), storeId: self.storeid(), dateFrom: self.dateFrom(), dateTo: self.dateTo},
				success: function(topSelling) {
					var topSellingArray = [];
					
					$.each(topSelling, function(key, value){
					    console.log(key, value);
						var element = [];
						
						element.push(key);
						element.push(value);
						
						topSellingArray.push(element);
					});
					
					Highcharts.chart('barGraph1', {
					    chart: {
					        type: 'column'
					    },
					    title: {
					        text: 'Top-selling by quantity'
					    },
					    xAxis: {
					        type: 'category',
					        labels: {
					            rotation: -45,
					            style: {
					                fontSize: '13px',
					                fontFamily: 'Verdana, sans-serif'
					            }
					        }
					    },
					    yAxis: {
					        min: 0,
					        title: {
					            text: 'Quantity'
					        }
					    },
					    legend: {
					        enabled: false
					    },
					    tooltip: {
					        pointFormat: 'As of the moment: <b>{point.y}pcs</b>'
					    },
					    series: [{
					        name: 'Quantity',
					        data: topSellingArray,
					        dataLabels: {
					            enabled: true,
					            rotation: -90,
					            color: '#FFFFFF',
					            align: 'right',
					            format: '{point.y}', // one decimal
					            y: 10, // 10 pixels down from the top
					            style: {
					                fontSize: '13px',
					                fontFamily: 'Verdana, sans-serif'
					            }
					        }
					    }]
					});
					
				},
				error: function(jqXHR, textStatus, errorThrown) {
				}
			});
		};
		self.getTopSellingByAmount = function() {
			var url = "getTopSellingByAmount";
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.areaid(), storeId: self.storeid(), dateFrom: self.dateFrom(), dateTo: self.dateTo},
				success: function(topSelling) {
					var topSellingArray = [];
					
		
					$.each(topSelling, function(key, value){
					    console.log(key, value);
					  //process receipts
						var element = [];
						
						element.push(key);
						element.push(value);
						
						topSellingArray.push(element);
					});				
					Highcharts.chart('barGraph2', {
					    chart: {
					        type: 'column'
					    },
					    title: {
					        text: 'Top-selling by amount'
					    },
					    xAxis: {
					        type: 'category',
					        labels: {
					            rotation: -45,
					            style: {
					                fontSize: '13px',
					                fontFamily: 'Verdana, sans-serif'
					            }
					        }
					    },
					    yAxis: {
					        min: 0,
					        title: {
					            text: 'Amount (PhP)'
					        }
					    },
					    legend: {
					        enabled: false
					    },
					    tooltip: {
					        pointFormat: 'As of the moment: <b>{point.y:.2f}Php</b>'
					    },
					    series: [{
					        name: 'Sales',
					        data: topSellingArray,
					        dataLabels: {
					            enabled: true,
					            rotation: -90,
					            color: '#FFFFFF',
					            align: 'right',
					            format: '{point.y:.1f}', // one decimal
					            y: 10, // 10 pixels down from the top
					            style: {
					                fontSize: '13px',
					                fontFamily: 'Verdana, sans-serif'
					            }
					        }
					    }]
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
				}
			});
		};
		self.displayPaymentTypes = function() {
			var cashNum = 0;
			var debitNum = 0;
			var creditNum = 0;
			var voucherNum = 0;
			for(var x in self.payments()) {
				if(self.payments()[x].pPaymentType()=="Cash") {
					cashNum++;
				} else if (self.payments()[x].pPaymentType()=="Debit") {
					debitNum++;
				} else if (self.payments()[x].pPaymentType()=="Credit") {
					creditNum++;
				} else if (self.payments()[x].pPaymentType()=="Voucher") {
					voucherNum++;
				}
			}
			
			//clean the array first
			self.paymentSummary.removeAll();
		
			var paymentArray = [{name: 'Cash', y: cashNum},{name: 'Debit', y: debitNum},{name: 'Credit', y: creditNum}, {name: 'Voucher', y: voucherNum}];
			
			//High charts
			// Build the chart
		    Highcharts.chart('chartsContainer', {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false,
		            type: 'pie'
		        },
		        title: {
		            text: 'Payment type shares'
		        },
		        tooltip: {
		            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br/>Quantity: <b>{point.y}</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: false
		                },
		                showInLegend: true
		            }
		        },
		        series: [{
		            name: 'Payment types',
		            colorByPoint: true,
		            data: paymentArray
		        }]
		    });
		};		
		self.getPayments = function() {
			var url = 'getPayments';
			
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.areaid(), storeId: self.storeid(), dateFrom: self.dateFrom(), dateTo: self.dateTo},
				success: function(payments) {
					//map to payments array
					var mappedItems = $.map(payments, function(payment) { return new Payment(payment); });
			        //save to array
					self.payments(mappedItems);
					
					//clean data
					self.displayPaymentTypes();
				}
			});
		};
		
		self.getReceipts = function() {
			var url = 'getReceipts';
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.areaid(), storeId: self.storeid(), dateFrom: self.dateFrom(), dateTo: self.dateTo},
				success: function(receipts) {
					//set transactions count
					self.transactionCount(receipts.length);
					
					//get the total sales
					self.getTotalSales(receipts);

					//map to receipts array
					var mappedItems = $.map(receipts, function(receipt) { return new Receipt(receipt); });
			        //save to array
					self.receipts(mappedItems);
					
					var receiptArray = [];
					//process receipts
					for(var x in self.receipts()) {
						var element = [];
						
						element.push(self.receipts()[x].timestamp());
						element.push(self.receipts()[x].amountDue());
						
						receiptArray.push(element);
					}
					
					Highcharts.setOptions({
				        global: {
				            useUTC: false
				        },
				        lang: {
				            thousandsSep: ','
				        }
				    });
					
					//generate high chart
					Highcharts.chart('timeseriesContainer', {
				        chart: {
				            zoomType: 'x'
				        },
				        title: {
				            text: 'Sales over time'
				        },
				        xAxis: {
				            type: 'datetime'
				        },
				        yAxis: {
				            title: {
				                text: 'Amount'
				            }
				        },
				        legend: {
				            enabled: false
				        },
				        plotOptions: {
				            area: {
				                fillColor: {
				                    linearGradient: {
				                        x1: 0,
				                        y1: 0,
				                        x2: 0,
				                        y2: 1
				                    },
				                    stops: [
				                        [0, Highcharts.getOptions().colors[0]],
				                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
				                    ]
				                },
				                marker: {
				                    radius: 2
				                },
				                lineWidth: 1,
				                states: {
				                    hover: {
				                        lineWidth: 1
				                    }
				                },
				                threshold: null
				            }
				        },

				        series: [{
				            type: 'area',
				            name: 'Sales',
				            data: receiptArray
				        }]
				    });
					
					//high charts
				    var gaugeOptions = {

				    	    chart: {
				    	        type: 'solidgauge'
				    	    },

				    	    title: null,

				    	    pane: {
				    	        center: ['50%', '85%'],
				    	        size: '140%',
				    	        startAngle: -90,
				    	        endAngle: 90,
				    	        background: {
				    	            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
				    	            innerRadius: '60%',
				    	            outerRadius: '100%',
				    	            shape: 'arc'
				    	        }
				    	    },

				    	    tooltip: {
				    	        enabled: false
				    	    },

				    	    // the value axis
				    	    yAxis: {
				    	        stops: [
				    	            [0.1, '#55BF3B'], // green
				    	            [0.5, '#DDDF0D'], // yellow
				    	            [0.9, '#DF5353'] // red
				    	        ],
				    	        lineWidth: 0,
				    	        minorTickInterval: null,
				    	        tickAmount: 2,
				    	        title: {
				    	            y: -70
				    	        },
				    	        labels: {
				    	            y: 16
				    	        }
				    	    },

				    	    plotOptions: {
				    	        solidgauge: {
				    	            dataLabels: {
				    	                y: 5,
				    	                borderWidth: 0,
				    	                useHTML: true
				    	            }
				    	        }
				    	    }
				    	};

				    	
				    	// The RPM gauge
				    	Highcharts.chart('sales', Highcharts.merge(gaugeOptions, {
//				    		formatter: function () {
//				    			  return Highcharts.numberFormat(self.totalSales(), 1, '.', ',');
//				    			},
				    	    yAxis: {
				    	        min: 0,
				    	        max: 50000000,
				    	        title: {
				    	            text: 'Sales'
				    	        }
				    	    },

				    	    series: [{
				    	        name: 'Sales',
				    	        data: [self.totalSales()],
				    	        dataLabels: {
				    	            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
				    	                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y: ,.2f}</span><br/>' +
				    	                   '<span style="font-size:12px;color:silver">PhP</span></div>'
				    	        },
				    	        tooltip: {
				    	            valueSuffix: ' PhP'
				    	        }
				    	    }]

				    	}));
				    	
				    	// The speed gauge
				    	Highcharts.chart('purchases', Highcharts.merge(gaugeOptions, {
				    	    yAxis: {
				    	        min: 0,
				    	        max: 1000,
				    	        title: {
				    	            text: 'No. of Purchases'
				    	        }
				    	    },

				    	    credits: {
				    	        enabled: false
				    	    },

				    	    series: [{
				    	        name: 'Transactions',
				    	        data: [self.transactionCount()],
				    	        dataLabels: {
				    	            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
				    	                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
				    	                   '<span style="font-size:12px;color:silver">Quantity</span></div>'
				    	        },
				    	        tooltip: {
				    	            //valueSuffix: ' km/h'
				    	        }
				    	    }]

				    	}));
					
				}
			});
		};
		
		//get all reports for high charts and dashboards
		self.getAllReports = function() {
			//get reports/charts
			self.getReceipts();
			//get payments
			self.getPayments();
			//get top-selling
			self.getTopSellingByAmount();
			self.getTopSellingByQuantity();
			
		};
		
		//listen if new areaid is selected in selection
	    self.areaid.subscribe(function(newAreaIdValue) {
	    	if(newAreaIdValue) {
	    		//clear stores array
	    		self.stores.removeAll();
	    		//update the selection in store branches
	    		for(var x in self.storesCopy()) {
	    			if ((self.storesCopy()[x].area_id() == newAreaIdValue)) {
	    				self.stores.push(self.storesCopy()[x]);
	    			}
	    		}
	    		
	    	}
	    	else {
	    		//return copy of stores
	    		self.stores(self.storesCopy().slice());
	    		//set value
	    		self.storeid(null);
	    		
	    	}
	    });
	    
	    
	    
	    
		
	}
	ko.applyBindings(new ReportViewModel());
});
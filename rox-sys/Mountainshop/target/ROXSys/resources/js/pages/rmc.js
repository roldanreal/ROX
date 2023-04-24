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
	    this.zoomLevel = ko.observable(area.zoomLevel);
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
	
	function RMCViewModel() {
		var self = this;
			
		//colors pre-assigned to layers: Blue, Yellow, Red, Gray, Black
		self.layerColors = ['#0000FF', '#FFFF00', '#FF0000', '#808080', '#000000'];
		
		//global variables for use in high charts
		self.currentAreaId = ko.observable(0);
		self.currentStoreId = ko.observable(0);
		self.currentViewContainer = ko.observable("Philippines");
		self.currentView = ko.observable(self.currentViewContainer());
		self.gTimer = null;
		self.gStatuses = [false, false, false, false];
		
		//used in the list
		self.stores = ko.observableArray([]);
		self.areas = ko.observableArray([]);
		
		//boolean for zooms
		self.LuzonIsZoomed = ko.observable(false);
		self.VisayasIsZoomed = ko.observable(false);
		self.MindanaoIsZoomed = ko.observable(false);
		
		//used in charts
		self.transactionCount = ko.observable(0);
		self.totalSales = ko.observable(0);
		self.payments = ko.observableArray([]);
		self.paymentSummary = ko.observableArray([]);
		
		//markers
		self.markers = ko.observableArray([]);
		// marker properties
		var cartMarker = L.AwesomeMarkers.icon({
			markerColor: 'red',
			prefix: 'glyphicon',
		    icon: 'shopping-cart',
		    iconColor: 'black'
		});
		var clickedMarker = L.AwesomeMarkers.icon({
			markerColor: 'green',
			prefix: 'glyphicon',
		    icon: 'shopping-cart',
		    iconColor: 'black'
		});
		
		
	    
		//get the list of stores on first load from DB
	    $.getJSON("get-stores", function(allData) {
	        var mappedItems = $.map(allData, function(store) { return new Store(store); });
	        //assign to stores
	        self.stores(mappedItems);
	    });
	    
	    var customControl = L.Control.extend({
			  options: {
			    position: 'topleft' 
			    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
			  },
			  onAdd: function (map) {
				    var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom');
				    return container;
			  }
		});
	    
		//initialise the map
		var mymap = L.map('rmcMap', { zoomControl: false });
		// Disable drag and zoom handlers.
		mymap.touchZoom.disable();
		mymap.scrollWheelZoom.disable();
		mymap.keyboard.disable();
		mymap.dragging.disable();
		mymap.doubleClickZoom.disable(); 
		//add custom control
		mymap.addControl(new customControl());
		
		//popup
		var layerPopup = null;
		
		// load a tile layer
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		    minZoom: 5,
		    maxZoom: 18,
		    id: 'roldanreal.pmm3gdhh',
		    accessToken: 'pk.eyJ1Ijoicm9sZGFucmVhbCIsImEiOiJjaW15OXZkNGswM3p3djdrazdmbHVrdHl2In0.Q1oLza6ZqNpyKDiGs24wbg'
		}).addTo(mymap);
		
		//set zoomed to false
		self.LuzonIsZoomed(false);
		self.VisayasIsZoomed(false);
		self.MindanaoIsZoomed(false);
		
		//get the list of areas on first load from DB
	    $.getJSON("get-areas", function(allData) {
	    	var mappedItems = $.map(allData, function(area) { return new Area(area); });
	        //assign to areas
	        self.areas(mappedItems);
	    }); 		

		//GeoJSON Layer Luzon
		var geojsonLuzonLayer = new L.GeoJSON.AJAX('getLuzonJson', {color: '#0000FF', weight: 2}).addTo(mymap);
		//GeoJSON Layer Visayas
		var geojsonVisayasLayer = new L.GeoJSON.AJAX('getVisayasJson', {color: '#FFFF00', weight: 2}).addTo(mymap);
		//GeoJSON Layer Mindana
		var geojsonMindanaoLayer = new L.GeoJSON.AJAX('getMindanaoJson', {color: '#FF0000', weight: 2}).addTo(mymap);
		
		self.viewPhils = function() {
			//initially, display Philippines only as Control
			var controlDiv = $('.leaflet-control-custom');
			//empty it first
			controlDiv.empty();
			var link = "<div id='custom-controls'>Active:&nbsp;&nbsp;<a id='ph-custom-control' href='#'>Philippines</a></div>";
			controlDiv.append(link);
			//remove the store layers
			for(var x in self.markers()) {
				mymap.removeLayer(self.markers()[x]);
			}
			//empty markers list
			self.markers.removeAll();
			
			//set the strokes
			geojsonLuzonLayer.setStyle({stroke : '#0000FF'});
			geojsonVisayasLayer.setStyle({stroke :'#FFFF00'});
			geojsonMindanaoLayer.setStyle({stroke :'#FF0000'});
			
			//bind event
			$('#ph-custom-control').on('click', function() {
				self.viewPhils();
			});
			mymap.setView([11.600960, 123.473753], 5); //Visayan Sea, Philippines as center
			
			//set global variables
			self.currentAreaId(0);
			self.currentStoreId(0);
			self.currentViewContainer("Philippines");
			
			//reset flags
			self.LuzonIsZoomed(false);
			self.VisayasIsZoomed(false);
			self.MindanaoIsZoomed(false);
			
			
		};
		
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
			self.totalSales(money);
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
		    Highcharts.chart('graphContainer', {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false,
		            type: 'pie'
		        },
		        title: {
		            text: 'Payment types'
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
			var statusIdx = 2 - 1;
			//if request is not yet done, wait for request to be done
	        if (self.gStatuses[statusIdx]) {
	   			console.log("Report 2: waiting for response, skip request");
	   			return;
	   		}
	        self.gStatuses[statusIdx] = true;
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.currentAreaId(), storeId: self.currentStoreId()},
				success: function(payments) {
					//map to payments array
					var mappedItems = $.map(payments, function(payment) { return new Payment(payment); });
			        //save to array
					self.payments(mappedItems);
					
					//clean data
					self.displayPaymentTypes();
					
					//set to false
					self.gStatuses[statusIdx] = false;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//set to false
					self.gStatuses[statusIdx] = false;
				}
			});
		};
		
		self.getCustomers = function() {
			var url = 'getReceipts';
			var statusIdx = 1 - 1;
			//if request is not yet done, wait for request to be done
	        if (self.gStatuses[statusIdx]) {
	   			console.log("Report 1: waiting for response, skip request");
	   			return;
	   		}
	        self.gStatuses[statusIdx] = true;
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.currentAreaId(), storeId: self.currentStoreId()},
				success: function(receipts) {
					//set transactions count
					self.transactionCount(receipts.length);
					
					//get the total sales
					self.getTotalSales(receipts);
					
					//clean total sales
					self.displayMoney(self.totalSales());
					
					//set view
					self.currentView(self.currentViewContainer());
					
					//set to false
					self.gStatuses[statusIdx] = false;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//set to false
					self.gStatuses[statusIdx] = false;
				}
			});
		};
		//
		self.getTopSellingByAmount = function() {
			var url = "getTopSellingByAmount";
			var statusIdx = 4 - 1;
			//if request is not yet done, wait for request to be done
	        if (self.gStatuses[statusIdx]) {
	   			console.log("Report 4: waiting for response, skip request");
	   			return;
	   		}
	        self.gStatuses[statusIdx] = true;
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.currentAreaId(), storeId: self.currentStoreId()},
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
					Highcharts.chart('barGraphContainer2', {
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
					
					//set to false
					self.gStatuses[statusIdx] = false;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//set to false
					self.gStatuses[statusIdx] = false;
				}
			});
		};
		self.getTopSellingByQuantity = function() {
			var url = "getTopSellingByQuantity";
			var statusIdx = 3 - 1;
			//if request is not yet done, wait for request to be done
	        if (self.gStatuses[statusIdx]) {
	   			console.log("Report 3: waiting for response, skip request");
	   			return;
	   		}
	        self.gStatuses[statusIdx] = true;
			$.ajax({
				url: url,
				dataType: 'json',
				data: {areaId: self.currentAreaId(), storeId: self.currentStoreId()},
				success: function(topSelling) {
					var topSellingArray = [];
					
					$.each(topSelling, function(key, value){
					    console.log(key, value);
						var element = [];
						
						element.push(key);
						element.push(value);
						
						topSellingArray.push(element);
					});
					
					Highcharts.chart('barGraphContainer1', {
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
					
					//set to false
					self.gStatuses[statusIdx] = false;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//set to false
					self.gStatuses[statusIdx] = false;
				}
			});
		};
		
		//get all reports for high charts and dashboards
		self.getAllReports = function() {
			if (self.gTimer) {
				clearTimeout(self.gTimer);
			}
			console.log("getting all reports: current view: " + self.currentViewContainer());
			//get reports/charts
			self.getCustomers();
			//get payments
			self.getPayments();
			//get topselling by quantity
			self.getTopSellingByQuantity();
			//get topselling by amount
			self.getTopSellingByAmount();
			gTimer = setTimeout(function() {self.getAllReports();}, 5000);
		};
		
		//first view
		self.viewPhils();
		//get reports
		self.getAllReports();
		
		//a function that sets markers
		self.setMarkers = function(feature) {
			var areaId = feature.properties.AreaId;
			for(var x in self.stores()) {
				//Add the stores to map
    			if ((self.stores()[x].area_id() == areaId)) {
    				var lat = self.stores()[x].coordinates().split(",")[0];
    				var long = self.stores()[x].coordinates().split(",")[1];
    				//extend the marker to add the branch name in the options
    				var customMarker = L.Marker.extend({
    					options: { 
    						branchName: self.stores()[x].branchName(),
    						storeId: self.stores()[x].storeId()
    					}
    				});
    				var marker = new customMarker([lat,long], {icon: cartMarker}).addTo(mymap)
    			    .bindPopup('<img src=\'resources/images/favicon.ico\'></img><strong>' + self.stores()[x].branchName() + '</strong><br />' +
    			    		self.stores()[x].address() + '<br/>'
    			    		, {autoPan:true})
    			    .on('mouseover', function() { this.openPopup(); })
    				.on('mouseout', function() { this.closePopup(); })
    				.on('click', function(e) {
    					//reset all icons
    					for(var y in self.markers()) {
    						var indivMarker = self.markers()[y];
    						indivMarker.setIcon(cartMarker);
    					}
    					//set icon color to green
    					this.setIcon(clickedMarker);
    					//remove first custom control link for branch
    					$('#branch-custom-control').remove();
    					//update the control
    					var controlDiv = $('#custom-controls');
    					//add the branch name
    					var link = "<span id='branch-custom-control'> &nbsp;><a href='#'>&nbsp;" + e.target.options.branchName; + "</a></span>";
    					controlDiv.append(link);
    					//set current view
    					self.currentViewContainer(e.target.options.branchName);
    					//current storeID
    					self.currentStoreId(e.target.options.storeId);
    				});
    				
    				
    				self.markers.push(marker);
    			}
    		}
		};
		
		self.viewArea = function(area) {
			//reset all icons
			for(var x in self.markers()) {
				var indivMarker = self.markers()[x];
				indivMarker.setIcon(cartMarker);
			}
			//remove the branch in Control
			var branchLink = $('#branch-custom-control');
			branchLink.remove();
			//set storeId to 0
			self.currentStoreId(0);
			//set the text
			self.currentViewContainer(area);
		};
		
		//Mouse events for Luzon
		geojsonLuzonLayer.on("mouseover", function (e) {
			mymap.dragging._draggable._freeze=true;
			var lat = e.latlng.lat;
			var lang = e.latlng.lng;
			layerPopup = L.popup()
			.setLatLng([lat, lang])
	        .setContent("<b>Luzon</b>")
	        .openOn(mymap);
		});
		
		geojsonLuzonLayer.on("mouseout", function (e) {
			mymap.dragging._draggable._freeze=true;
			mymap.closePopup(layerPopup);
			layerPopup = null;
		});
		
		geojsonLuzonLayer.on("click", function (e) {
			if(!self.LuzonIsZoomed()) {
				//Add the stores
				geojsonLuzonLayer.refilter(function(feature){
					//set markers
					self.setMarkers(feature);
				});
				mymap.setView([14.57794,120.9746711],7); //Rizal Park, Manila as center
				//set zoomed to true
				self.LuzonIsZoomed(true);
				//add to control
				var controlDiv = $('#custom-controls');
				var link = "<span id='area-custom-control'>&nbsp;><a  id='mm-custom-control' href='#'>&nbsp;Luzon</a></span>";
				controlDiv.append(link);
				//bind event
				$('#mm-custom-control').on('click', function() {
					self.viewArea('Luzon');
				});
				//set current view to Luzon, areaId 1 == Luzon
				self.currentAreaId(1);
				//set storeId to 0
				self.currentStoreId(0);
				//set the text
				self.currentViewContainer("Luzon");
				
			}
			
			else {
				self.viewPhils();
			}
			
		});
		//Mouse events for Cebu area
		geojsonVisayasLayer.on("mouseover", function (e) {
			var lat = e.latlng.lat;
			var lang = e.latlng.lng;
			layerPopup = L.popup()
			.setLatLng([lat, lang])
	        .setContent("<b>Visayas</b>")
	        .openOn(mymap);
		});
		
		geojsonVisayasLayer.on("mouseout", function (e) {
			mymap.closePopup(layerPopup);
			layerPopup = null;
		});
		
		geojsonVisayasLayer.on("click", function (e) {
			if(!self.VisayasIsZoomed()) {
				//Add the stores
				geojsonVisayasLayer.refilter(function(feature){
					//set markers
					self.setMarkers(feature);
				});
				mymap.setView([10.425131, 123.575514], 9); //set to Tanon Strait, Negros Occidental as center
				//set zoomed to true
				self.VisayasIsZoomed(true);
				//add to control
				var controlDiv = $('#custom-controls');
				var link = "<span id='area-custom-control'>&nbsp;><a  id='cebu-custom-control' href='#'>&nbsp;Visayas</a></span>";
				controlDiv.append(link);
				//bind event
				$('#cebu-custom-control').on('click', function() {
					self.viewArea('Visayas');
				});
				//set current view to Visayas, areaId 2 == Visayas
				self.currentAreaId(2);
				//set storeId to 0
				self.currentStoreId(0);
				//set the text
				self.currentViewContainer("Visayas");
			}
			
			else {
				self.viewPhils();
			}
			
		});
		
		//Mouse events for Davao area
		geojsonMindanaoLayer.on("mouseover", function (e) {
			var lat = e.latlng.lat;
			var lang = e.latlng.lng;
			layerPopup = L.popup()
			.setLatLng([lat, lang])
	        .setContent("<b>Mindanao</b>")
	        .openOn(mymap);
		});
		
		geojsonMindanaoLayer.on("mouseout", function (e) {
			mymap.closePopup(layerPopup);
			layerPopup = null;
		});
		
		geojsonMindanaoLayer.on("click", function (e) {
			if(!self.MindanaoIsZoomed()) {
				//Add the stores
				geojsonMindanaoLayer.refilter(function(feature){
					//set markers
					self.setMarkers(feature);
				});
				mymap.setView([8.0291503,124.2736951], 8); //set to Marawi City as center
				//set zoomed to true
				self.MindanaoIsZoomed(true);
				//add to control
				var controlDiv = $('#custom-controls');
				var link = "<span id='area-custom-control'>&nbsp;><a  id='davao-custom-control' href='#'>&nbsp;Mindanao</a></span>";
				controlDiv.append(link);
				//bind event
				$('#davao-custom-control').on('click', function() {
					self.viewArea('Mindanao');
				});
				//set current view to Mindanao, areaId 3 == Mindanao
				self.currentAreaId(3);
				//set storeId to 0
				self.currentStoreId(0);
				//set the text
				self.currentViewContainer("Mindanao");
			}
			
			else {
				self.viewPhils();
			}
		});
		
	}
	ko.applyBindings(new RMCViewModel());
});
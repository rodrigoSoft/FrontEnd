angular.module('app', [])
.controller('mainController',['$scope', '$http', function($scope, $http) {
	
	$scope.HolidayApiKey = '1e00dd4f-781a-48fe-aa52-bb8df5737a8f';
	$scope.SearchInYear = 2008;
	
	$scope.$StartDate = $('#StartDate');
	$scope.$Calendar = $('#Calendar');
	$scope.StartDate;
	$scope.NumberOfDays = 0;
	$scope.Country = null;
	$scope.CountryCode = "";
	
	$scope.HoliDays = {};
	$scope.MinDate = null;
	$scope.MaxDate = null;
	$scope.NumberOfMonths = 0;
	
	$scope.$StartDate.datepicker();
	
	$scope.setHoliDays = function (date) {
		var dateStr = date.getFullYear().toString() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2);
		if($scope.HoliDays.hasOwnProperty(dateStr)) {
			console.log(dateStr);
			console.log($scope.HoliDays[dateStr][0].name);
			return [true, 'holiday', $scope.HoliDays[dateStr][0].name];
		}
		return [true, ''];
	}
	
	$scope.getNumberOfMonths = function (startDate, endDate) {
	    var months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
		months += endDate.getMonth() - startDate.getMonth() + 1;
		return months <= 0 ? 0 : months;
	}
	
	$scope.getCalendar = function() {

		if($scope.NumberOfDays <= 0) {
			alert("Invalid data");
		}
		
		$scope.MinDate = $scope.$StartDate.datepicker('getDate');

		$scope.MaxDate = new Date($scope.MinDate.getTime());
		$scope.MaxDate.setDate($scope.MaxDate.getDate() + parseInt($scope.NumberOfDays) -1);
		$scope.NumberOfMonths = $scope.getNumberOfMonths($scope.MinDate, $scope.MaxDate);

		if($scope.MinDate.getFullYear() <= $scope.SearchInYear && $scope.SearchInYear <= $scope.MaxDate.getFullYear()) {

			$http.get('https://holidayapi.com/v1/holidays?key='+$scope.HolidayApiKey+'&country='+$scope.CountryCode+'&year='+$scope.SearchInYear).then(
				function(res){
					if(res.data && res.data.status == 200) {
						$scope.HoliDays = res.data.holidays;
						$scope.renderCalendar();
					}
				}, function(res) {
					if(res.data && res.data.error) {
						alert(res.data.error);
					}else {
						alert("Error: holidayapi");
					}
				});			
		}else {
			$scope.renderCalendar();
		}
	}
	
	$scope.renderCalendar = function() {
		$scope.$Calendar.datepicker("destroy").datepicker({
			showOtherMonths: true,
			beforeShowDay: $scope.setHoliDays,
			numberOfMonths: [$scope.NumberOfMonths, 1],
			minDate: $scope.MinDate, 
			maxDate: $scope.MaxDate
		});
	}
}]);
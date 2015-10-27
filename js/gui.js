app.directive('preview', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<div class="full" style="background: {{ngModel.getType().color}};"></div>'
	};
});

app.directive('feld', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<div class="full" style="background: {{ngModel.getType().color}}; text-align: center; padding: 45px;">'+
			'<div style="position: absolute; left: 45px; right: 45px; top: 0px; height: 45px; text-align: center;"><player ng-repeat="x in ngModel.players track by x.id" ng-model="x" ng-if="x.action && x.action[0] == \'move\' && x.action[1] == 0"></player></div>'+
			'<div style="position: absolute; left: 45px; right: 45px; bottom: 0px; height: 45px; text-align: center;"><player ng-repeat="x in ngModel.players track by x.id" ng-model="x" ng-if="x.action && x.action[0] == \'move\' && x.action[1] == 1"></player></div>'+
			'<div style="position: absolute; top: 50%; right: 0px; width: 45px;"><div style="margin: -50%;"><player ng-repeat="x in ngModel.players track by x.id" ng-model="x" ng-if="x.action && x.action[0] == \'move\' && x.action[1] == 2" style="display: block;"></player></div></div>'+
			'<div style="position: absolute; top: 50%; left: 0px; width: 45px;"><div style="margin: -50%;"><player ng-repeat="x in ngModel.players track by x.id" ng-model="x" ng-if="x.action && x.action[0] == \'move\' && x.action[1] == 3" style="display: block;"></player></div></div>'+
			'<h2>{{ngModel.getType().name}}</h2>'+
			'<div ng-if="ngModel.harvester">Arbeiter:<br/><player ng-model="ngModel.players[ngModel.harvester]"></player></div>'+
			'Personen:<br/><player ng-repeat="x in ngModel.players track by x.id" ng-model="x" ng-if="!x.action"></player>'+
			'</div>'
	};
});

app.directive('player', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<div class="player">'+
			'<bar max="10000" ng-model="ngModel.energy"></bar>'+
			'<span ng-if="ngModel.remaining">{{ngModel.remaining}}</span>'+
			'</div>'
	};
});

app.directive('bar', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=', max: '=' },
		template: '<div class="bar">'+
			'<div class="barbar" style="width: {{ngModel/max * 100}}%;"></div>'+
			'</div>'
	};
});

app.directive('schild', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<h3>{{schildtypen[ngModel.type].desc}}</h3>'+
			'<div ng-repeat="(par, type) in schildtypen[ngModel.type].params">Parameter [{{par}}]:<br/>'+
			'<bag ng-model="ngModel[par]" ng-if="type == \'material\' || type == \'getmaterial\'"></bag>'+
			'<span ng-if="type == \'coins\' || type == \'getcoins\'">{{ngModel[par]}} coins</span>'+
			'<span ng-if="type == \'schild\'">[strafe]</span>'+
			'</div>',
		controller: function ($scope) {
			$scope.schildtypen = schildtypen;
		}
	};
});

app.directive('neuSchild', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<select ng-model="ngModel.type"><option ng-value="type" ng-repeat="(type, o) in schildtypen">{{o.desc}}</option></select>'+
			'<div ng-repeat="(par, type) in schildtypen[ngModel.type].params">Parameter [{{par}}]:<br/>'+
			'<edit-bag ng-model="ngModel[par]"></edit-bag>'+
			'</div>',
		controller: function ($scope) {
			$scope.schildtypen = schildtypen;
			$scope.$watch('ngModel.type', function () {
				for (var i in $scope.ngModel) {
					if (i !== 'type') delete $scope.ngModel[i];
				}
				for (var i in schildtypen[$scope.ngModel.type].params) {
					$scope.ngModel[i] = defaultSchildValue[schildtypen[$scope.ngModel.type].params[i]];
				}
			});
		}
	}
});

app.directive('bag', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<ul><li ng-repeat="(item, menge) in ngModel track by $index">{{menge}}x {{item}}</li></ul>'
	};
});

app.directive('editBag', function () {
	return {
		restrict: 'E',
		scope: { ngModel: '=' },
		template: '<ul><li ng-repeat="(item, menge) in ngModel">{{menge}}x {{item}} <button ng-click="add(item, 10)">+10</button><button ng-click="add(item, 1)">+1</button><button ng-click="add(item, -1)">-1</button><button ng-click="add(item, -10)">-10</button></li>'+
			'<li><input ng-model="neuFeld" /><button ng-click="ngModel[neuFeld] = 1">+</button></li></ul>', // TODO: Materialien-Dropdown
		controller: function ($scope) {
			$scope.add = function (type, i) {
				$scope.ngModel[type] = ($scope.ngModel[type] || 0) + i;
				if ($scope.ngModel[type] <= 0) {
					delete $scope.ngModel[type];
				}
			}
		}
	}
});

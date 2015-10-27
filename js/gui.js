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

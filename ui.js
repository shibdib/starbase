App = (function($, model) {
	var tower = null;

	function update_tower_types() {
		var show_faction = $('#tower-type-show-faction').is(':checked');
		$('#tower-type').empty();
		for (var idx in model.data.towers) {
			var t = model.data.towers[idx];
			if (model.data.tower(t).faction && !show_faction) {
				continue;
			}
			var e = $('<option />', {text: t});
			$('#tower-type').append(e);
		}
	}

	function update_tower_details() {
		var tt = model.data.tower(tower.type);

		$('#tower-details-name').text(tower.type);

		$('#tower-details-pg').text(tt.power);
		$('#tower-details-cpu').text(tt.cpu);

		$('#tower-details-pg-left').text(tower.getPower());
		$('#tower-details-cpu-left').text(tower.getCPU());

		var e_modules = $('#tower-details-modules');
		e_modules.empty();

		var mods = tower.getModules();
		var jsonmods = {};
		for (var idx in mods) {
			var m = mods[idx];
			jsonmods[m['name']] = m['count'];
			var tr = $('<tr>');
			tr.append($('<td>', {'text': m['name']}));
			tr.append($('<td>', {'text': m['count']}));
			tr.append($('<td>', {'text': m['power']}));
			tr.append($('<td>', {'text': m['cpu']}));
			var del_td = $('<td>');
			var del_button = $('<button>', {'text': '-'});
			del_button.click(function() {
				tower.remove(m['name']);
			});
			del_td.append(del_button);
			tr.append(del_td);
			e_modules.append(tr);
		}

		var jsondata = {
			'tower': tower.type,
			'mods': jsonmods,
		};

		$('#tower-json').text(JSON.stringify(jsondata, undefined, 4));
	}

	function set_tower_type() {
		tower.setType($('#tower-type').val());
	}

	function init_tower_types() {
		$('#tower-type-show-faction').change(update_tower_types);
		$('#tower-type-set').click(set_tower_type);
		update_tower_types();
	}

	function update_mod_picker() {
		var e_type = $('#mod-picker-type');
		var e_silly = $('#mod-picker-show-silly');
		var e_faction = $('#mod-picker-show-faction');

		var show_silly = e_silly.is(':checked');
		var show_faction = e_faction.is(':checked');

		var sel = e_type.val();

		e_type.empty();
		for (var idx in model.data.mods) {
			var m = model.data.mods[idx];
			if (!show_silly && tower.isModSilly(m)) {
				continue;
			}
			if (!show_faction && model.data.mod(m).faction) {
				continue;
			}
			var opts = {'text': m};
			if (m == sel) {
				opts['selected'] = 'selected';
			}
			var e = $('<option />', opts);
			e_type.append(e);
		}

	}

	function add_mod() {
		tower.add($('#mod-picker-type').val());
	}

	function init_mod_picker() {
		$('#mod-picker-show-silly').change(update_mod_picker);
		$('#mod-picker-show-faction').change(update_mod_picker);
		$('#mod-picker-add').click(add_mod);
		update_mod_picker();
	}

	function tower_updated() {
		update_tower_details();
		update_mod_picker();
	}

	function init() {
		tower = new Model.tower();

		init_tower_types();
		init_mod_picker();

		tower.update(tower_updated);

		set_tower_type();
	}

	$(document).ready(init);
})(jQuery, Model);
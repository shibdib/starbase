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

		$('#tower-details-pg').text(number_format(tt.power));
		$('#tower-details-cpu').text(number_format(tt.cpu));

		var pg_left = $('#tower-details-pg-left');
		pg_left.text(number_format(tower.getPower()));
		if(tower.getPower() >= 0)
		{
			pg_left.addClass('success');
			pg_left.removeClass('danger');
		}
		else
		{
			pg_left.addClass('danger');
			pg_left.removeClass('success');
		}

		var cpu_left = $('#tower-details-cpu-left');
		cpu_left.text(number_format(tower.getCPU()));
		if(tower.getCPU() >= 0)
		{
			cpu_left.addClass('success');
			cpu_left.removeClass('danger');
		}
		else
		{
			cpu_left.addClass('danger');
			cpu_left.removeClass('success');
		}

		var e_modules = $('#tower-details-modules');
		e_modules.empty();

		var mods = tower.getModules();
		for (var idx in mods) {
			var m = mods[idx];
			var tr = $('<tr>');
			tr.append($('<td>', {'text': m['name']}));
			tr.append($('<td><label class="label label-default">'+m['count']+'</label></td>'));
			tr.append($('<td>', {'text': number_format(m['power'])}));
			tr.append($('<td>', {'text': number_format(m['cpu'])}));
			var del_td = $('<td>');
			var add_button = $('<button class="btn btn-sm btn-success"><i class="fa fa-plus"></i></button>').on('click', function() {
				tower.add(m['name']);
			});
			var del_button = $('<button class="btn btn-sm btn-danger"><i class="fa fa-minus"></i></button>').on('click', function() {
				tower.remove(m['name']);
			});
			del_td.append(add_button).append('&nbsp;').append(del_button);
			tr.append(del_td);
			e_modules.append(tr);
		}
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
/*!
 * Documenter 1.6
 * http://rxa.li/documenter
 *
 * Copyright 2011, Xaver Birsak
 * http://revaxarts.com
 *
 */
//if Cufon replace headings
if (typeof Cufon == 'function') {
	Cufon.replace('h1, h2, h3, h4, h5, h6');
}

// Simply.me main code
$(function() {
	$("#skillItemList").sortable();
	$("#skillItemList").disableSelection();
	
	$("#rightTip").tooltip({
		title: "Click to directly edit content!",
		placement: "right",
	}).tooltip('show');
	
	$(".typeaheadList").each(function() {
		var $this = $(this);
		
		$(this).typeahead({
			source: function(query, typeahead) {
				return get_list($this.data('list'), typeahead)
			}
		});
	})
	
	// Events
	$("#btnAddTool").click(function() {
		var name = $("#typeaheadTools").val();
		var desc = $("#toolDescription").val();
		var listItem = generate_list_item(name,desc);
		
		$("#listExistingTools").append(listItem);
		newData.tiu[name] = desc;
	})

	// Clear inputs on modals
	$(".modal").on('show', function() {
		$("input, textarea").each(function(k,v) {
			$(v).val('');
		})
		
	})

	$("#tiuModal").on('show', function() {
		$("#listExistingTools").html('');
		
		$.each(sampleData.tiu, function(k,v) {
			$("#listExistingTools").append(generate_list_item(k,v));
		})
	});
	
	$("#profile-img").hover(function() {
		$("#profile-img-circle .icon-edit").toggle();
	});
	
	$("#profileImageModal").on('show', function() {
		$("#profile-img-edit").html($("#profile-img").clone().attr('id',''));
	})
	
	$(".skillItemRemove").click(function() {
		$(this).parents('.skillItem').remove();
	});
	
	$("#addMyWork").click(function() {
		$("#myWorkModal").modal('show');
	})
	
	$("#btnToolsSave").on('click', function() {
		$("#tiuModal").modal('hide');
		
		$.each(newData.tiu, function(k,v) {
			sampleData.tiu[k] = v;
			delete newData.tiu[k];
		})
		
		load_sample_data();
	})
	
	$("#btnAddSkill").on('click', function() {
		var sText = $("#typeaheadSkills").val();
		
		var skill = $("<div>", {
			text: sText 
		});
		
		$("#listExistingSkills").append(skill);
		
		$("#typeaheadSkills").val('');
		newData.skills.push(sText)
	})
	
	$("#skillsSave").on('click', function() {
		$("#skillsModal").modal('hide');
		
		var template = $("#skillItemTemplate").clone().removeAttr('id').show();
		template.find('.skillItemHeading').text($("#typeaheadSkillHeadings").val());
		
		$.each(newData.skills, function(k,v) {
			if (k > 0) {
				v = " / " + v;
			}
			
			template.find('.skillItemSkills').append(v);
		})
		
		$("#skillItemList").append(template);
		$("#listExistingSkills").html('');
		newData.skills = [];
	})

	$("#editModal").draggable();
	
	$("#editModal").on('shown', function() {
		console.log(1)
		$(".modal-backdrop").remove();
	})
	
	$(".bgImage").click(function() {
		var src = $(this).find('img').attr('src');
		$("#home").css('background-image', 'url('+src+')');
	})
	
	function generate_list_item(name, desc)
	{
		var listItem = $("#listItemTemplate").clone().removeAttr('id').show();

		listItem.children('.toolName').text(name);
		listItem.children('.toolDescription').text(desc);
		
		return listItem;
	}
	
	function get_list(name, typeahead)
	{
		return $.get('/api/list/'+name, function(data) {
			return typeahead(data);
		})
	}

	function load_sample_data()
	{
		$("#tiuList").html('');
		$.each(sampleData.tiu, function(k,v) {
			var tool = $("#tiuTemplate").clone();
			tool.removeAttr('id').show();
			tool.children('.toolName').text(k);
			tool.children('.toolDesc').text(v)
			
			$("#tiuList").append(tool);	
		})
	}
	
	load_sample_data();
})

// Other jQuery
$(document)
		.ready(
				function() {
					var timeout, sections = [], sectionscount = 0, win = $(window), sidebar = $('#documenter_sidebar'), nav = $('#documenter_nav'), logo = $('#documenter_logo'), navanchors = nav
							.find('a'), timeoffset = 50, hash = location.hash
							|| null;
					iDeviceNotOS4 = (navigator.userAgent
							.match(/iphone|ipod|ipad/i) && !navigator.userAgent
							.match(/OS 5/i)) || false, badIE = $('html').prop(
							'class').match(/ie(6|7|8)/) || false;

					// handle external links (new window)
					$('a[href^=http]').bind('click', function() {
						window.open($(this).attr('href'));
						return false;
					});

					make_sortable();

					$('#but_contact_addr').click(function() {
						if ($('#contactaddress').is(':hidden')) {
							$('#contactaddress').show('slow');
							$(this).html('Navigate me through map');
						} else {
							$('#contactaddress').hide('slow');
							$(this).html('Show contact info');
						}
					});

					// IE 8 and lower doesn't like the smooth pagescroll
					if (!badIE) {
						window.scroll(0, 0);

						$('a[href^=#]').bind('click touchstart', function() {
							hash = $(this).attr('href');
							$.scrollTo.window().queue( []).stop();
							goTo(hash);
							return false;
						});

						// if a hash is set => go to it
						if (hash) {
							setTimeout(function() {
								goTo(hash);
							}, 500);
						}
					}

					// We need the position of each section until the full page
					// with all images is loaded
					win
							.bind(
									'load',
									function() {

										var sectionselector = 'section';

										// Documentation has subcategories
										if (nav.find('ol').length) {
											sectionselector = 'section, h4';
										}
										// saving some information
										$(sectionselector).each(function(i, e) {
											var _this = $(this);
											var p = {
												id : this.id,
												pos : _this.offset().top
											};
											sections.push(p);
										});

										// iPhone, iPod and iPad don't trigger
										// the scroll event
										if (iDeviceNotOS4) {
											nav
													.find('a')
													.bind(
															'click',
															function() {
																setTimeout(
																		function() {
																			win
																					.trigger('scroll');
																		},
																		duration);

															});
											// scroll to top
											window.scroll(0, 0);
										}

										// how many sections
										sectionscount = sections.length;

										// bind the handler to the scroll event
										win
												.bind(
														'scroll',
														function(event) {
															clearInterval(timeout);
															// should occur with
															// a delay
															timeout = setTimeout(
																	function() {
																		// get
																		// the
																		// position
																		// from
																		// the
																		// very
																		// top
																		// in
																		// all
																		// browsers
																		pos = window.pageYOffset
																				|| document.documentElement.scrollTop
																				|| document.body.scrollTop;

																		// iDeviceNotOS4s
																		// don't
																		// know
																		// the
																		// fixed
																		// property
																		// so we
																		// fake
																		// it
																		if (iDeviceNotOS4) {
																			sidebar
																					.css( {
																						height : document.height
																					});
																			logo
																					.css( {
																						'margin-top' : pos
																					});
																		}
																		// activate
																		// Nav
																		// element
																		// at
																		// the
																		// current
																		// position
																		activateNav(pos);
																	},
																	timeoffset);
														}).trigger('scroll');

									});

					// the function is called when the hash changes
					function hashchange() {
						goTo(location.hash, false);
					}

					// scroll to a section and set the hash
					function goTo(hash, changehash) {
						win.unbind('hashchange', hashchange);
						hash = hash.replace(/!\//, '');
						win.stop().scrollTo(hash, duration, {
							easing : easing,
							axis : 'y'
						});
						if (changehash !== false) {
							var l = location;
							location.href = (l.protocol + '//' + l.host
									+ l.pathname + '#!/' + hash.substr(1));
						}
						win.bind('hashchange', hashchange);
					}

					// activate current nav element
					function activateNav(pos) {
						var offset = 100, current, next, parent, isSub, hasSub;
						win.unbind('hashchange', hashchange);
						for ( var i = sectionscount; i > 0; i--) {
							if (sections[i - 1].pos <= pos + offset) {
								navanchors.removeClass('current');
								current = navanchors.eq(i - 1);
								current.addClass('current');

								parent = current.parent().parent();
								next = current.next();

								hasSub = next.is('ol');
								isSub = !parent.is('#documenter_nav');

								nav.find('ol:visible').not(parent).slideUp(
										'fast');
								if (isSub) {
									parent.prev().addClass('current');
									parent.stop().slideDown('fast');
								} else if (hasSub) {
									next.stop().slideDown('fast');
								}
								win.bind('hashchange', hashchange);
								break;
							}
						}
					}
				});

function make_sortable() {

	if ($('.grace_sortable').length === 0) {
		return;
	}

	var $preferences = {};

	if ($('.grace_sortable').data('duration')) {
		$preferences.duration = $('.sortable').data('duration');
	} else {
		$preferences.duration = 700;
	}

	$preferences.useScaling = false;

	if ($('.grace_sortable').data('easing')) {
		$preferences.easing = $('.grace_sortable').data('easing');
	} else {
		$preferences.easing = 'easeInOutExpo';
	}

	if ($('.grace_sortable').data('autoheight')) {
		$preferences.adjustHeight = eval($('.grace_sortable').data('autoheight'));
	} else {
		$preferences.adjustHeight = 'dynamic';
	}

	var $list = $('.grace_sortable');
	$list.find('li').each(function(index) {
		$(this).attr('data-id', index + 1);
	});

	$list.find('li > a').on("click", function() {
		if ($(this).data('rel') && $('#' + $(this).data('rel')).length > 0) {
			$t = $('#' + $(this).data('rel'));
			$li = $(this).parent();
			$li.parent().find('.hoverinfo').removeClass('active');
			$li.find('.hoverinfo').addClass('active');
			$t.parent().find('li').hide();
			$t.css( {
				position : 'absolute',
				top : $li.position().top + $li.height(),
				left : $li.parent().position().left,
				zIndex : 999
			}).show('slow');
			$.scrollTo($li, 800);
		}
	});

	$('.work-info').find('.cls').click(function(event) {
		$(this).parent().hide('slow');
		$list.find('.hoverinfo').removeClass('active');
		event.preventDefault();
	});

	var $data = $list.clone();
	var $button_class = $list.data('buttonclass');
	
	$('.' + $button_class).bind('click', function(e) {
		var $$ = $(this);

		$$.parent().parent().find('li').removeClass('active');

		$$.parent().addClass('active');

		var $filtered_data;

		if ($$.data('sorttype') == 'all') {
			$filtered_data = $data.find('li');
		} else {
			$filtered_data = $data.find('li.' + $$.data('sorttype'));
		}

		$list.quicksand($filtered_data, $preferences, quicksand_callback);

		e.preventDefault();
	});
}

function quicksand_callback() {

	var $list = $('.grace_sortable');

	$list.find('li > a').off("click");

	$list.find('li > a').on("click", function() {
		if ($(this).data('rel') && $('#' + $(this).data('rel')).length > 0) {
			$t = $('#' + $(this).data('rel'));
			$li = $(this).parent();

			$li.parent().find('.hoverinfo').removeClass('active');
			$li.find('.hoverinfo').addClass('active');

			$t.parent().find('li').hide();
			$t.css( {
				position : 'absolute',
				top : $li.position().top + $li.height(),
				left : $li.parent().position().left,
				zIndex : 999
			}).show('slow');
			$.scrollTo($li, 800);
		}
	});
}
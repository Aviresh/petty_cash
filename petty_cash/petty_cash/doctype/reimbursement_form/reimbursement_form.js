// Copyright (c) 2021, Admin and contributors
// For license information, please see license.txt

function remove_rows(data, i, frm) {

	frm.get_field("reimbursement_table").grid.grid_rows[i].remove();
	frm.refresh_field("reimbursement_table")
}

function department_approval_details(frm, data) {
	$.each(data.reimbursement_table, function (i, d) {

		var pettycash_id = d.reqst_no;

		// frappe.db.set_value("PettyCash Request", pettycash_id, "finance_approval_by", frm.doc.finance_approval_by);
		frappe.call({
			method: "petty_cash.petty_cash.doctype.reimbursement_form.reimbursement_form.petty_cash_update",
			args: {
				approved: 1,
				pettycash_id: pettycash_id,
				dep_app_by: frm.doc.department_approval_by,
				dep_date: frappe.datetime.nowdate()
			}
		});

	});
}

function finance_approval_details(data,frm){
	var docName = frm.doc.name;

	$.each(data.reimbursement_table, function (i, d) {
		var pettycash_id = d.reqst_no;
		// frappe.db.set_value("PettyCash Request", pettycash_id, "finance_approval_by", frm.doc.finance_approval_by);
		frappe.call({
			method: "petty_cash.petty_cash.doctype.reimbursement_form.reimbursement_form.petty_cash_update2",
			args: {
				approved: 1,
				pettycash_id: pettycash_id,
				fin_app_by: frm.doc.finance_approval_by,
				fin_date: frappe.datetime.nowdate(),
				reimburse_by: frappe.session.user_email,
				reimbursement_date: frappe.datetime.nowdate(),
				reimbursement_no :docName 

			}
		});

	});
}

function create_journal_entry(data, frm) {

	let je = {};
	var tot_amount = 0;
	var accounts = [];
	var journal_entry;

	//append the petty cash details
	$.each(data.reimbursement_table, function (i, d) {
		tot_amount = tot_amount + parseInt(d.amount);
		accounts[i] = {
			"doctype": "Journal Entry Account",
			"account": d.acc_debit,
			"party_type": "Employee",
			"debit_in_account_currency": 0,
			"credit_in_account_currency": d.amount,
			"user_remark": d.reason_for_request
		};
	});
	var index_count = accounts.length;[

	]
	//append the cash account with total amount
	accounts[index_count] = {
		"doctype": "Journal Entry Account",
		"account": "1110 - Cash - ABCMC",
		"party_type": "Employee",
		"debit_in_account_currency": tot_amount,
		"credit_in_account_currency": 0,
		"user_remark": ""
	};

	// assign header detais to Journal Entry
	je["doctype"] = "Journal Entry";
	je["posting_date"] = frappe.datetime.add_days(frm.doc.process_date, 0);
	je["accounts"] = accounts;

	frappe.db.insert(je)
		.then(function (doc) {
			frappe.call({
				"method": "frappe.client.submit",
				"args": {

					"doc": doc

				},
				"callback": (r) => {
					
					//write Journal Entry no in Reim Form
					journal_entry = r.message.name;
					frappe.db.set_value("Reimbursement Form", frm.doc.name, "journal_entry", journal_entry);
					frm.save();
					alert("New Journel Entry " + r.message.name + " was created successfully");
				}
			});
		});

	finance_approval_details(data,frm);
}

frappe.ui.form.on('Reimbursement Form', {

	validate: function (frm, cdt, cdn) {
		var data = locals[cdt][cdn];
		var row_count = data.reimbursement_table.length;

		if (frm.doc.__islocal == 1) {
			//write accepeted details
			frm.doc.department_approval_by = frappe.session.user_email;

			//remove unselected rows before saving
			$.each(data.reimbursement_table, function (i, d) {
				if (typeof data.reimbursement_table[i].__checked === 'undefined' || !data.reimbursement_table[i].__checked == 1) {
					remove_rows(data, i, frm);
				}
			});
			//check whether set the account type
			$.each(data.reimbursement_table, function (i, d) {
				if (!data.reimbursement_table[i].acc_debit) {
					frappe.msgprint("Enter account type for PettyCash No {0}", [data.reimbursement_table[i].reqst_no]);
				}
			});

			// update appraval details
			department_approval_details(frm,data);
		}
	},
	onload_post_render: function (frm, cdt, cdn) {

		if (!frm.doc.__islocal == 1) {

			//restric to press save on time
			frm.disable_save();

			//disable, if form has been saved and approved by finance dep
			if(frm.doc.finance_approval_by){
				// frm.set_df_property("send_for_claim", "hidden", true); 
			}

			//disable add new rows and delete lines
			frm.set_df_property("reimbursement_table", "read_only", 1);

			//disable approved details
			frm.set_df_property("department_approval_by", "read_only", 1);
			frm.set_df_property("finance_approval_by", "read_only", 1);

			//hide button,if doctype has been saved already
			frm.set_df_property("load_pending_request", "hidden", true);

			//hide button,if it has a journal entry
			if(frm.doc.journal_entry){
				frm.set_df_property("send_for_claim", "read_only", 1);
			}

			// disable some rows
			var loadRecods = frm.doc.reimbursement_table;
			loadRecods.forEach(function (e) {
				$("[data-idx='" + e.idx + "']").css('pointer-events', 'none');
				$("[data-idx='" + e.idx + "']").css('background', 'gray');
			})
		} 
		
		//new form,'send for claim' button should be invisible
		if (frm.doc.__islocal == 1){
			if(!frm.doc.finance_approval_by){
				frm.set_df_property("send_for_claim", "hidden", true);
			}
		}
	},

	send_for_claim: function (frm, cdt, cdn) {

		//this button is pressed by finance department
		var data = locals[cdt][cdn];

		//write accepeted details
		frm.doc.finance_approval_by = frappe.session.user_email;

		//department_approval(data, frm);
		create_journal_entry(data, frm);

	},

	load_pending_request: function (frm, cdt, cdn) {

		//assign data
		var start_date = frm.doc.request_date;
		var emp_code = frm.doc.emp_code;

		//calling for date formatting funtion
		formatDate(start_date);

		// clear table 
		frm.clear_table("reimbursement_table");
		frm.refresh_fields();

		//request data from serve side
		if (start_date && emp_code) {
			frappe.call({
				method: "petty_cash.petty_cash.doctype.reimbursement_form.reimbursement_form.petty_cash_req",
				args: {
					start_date: start_date,
					// emp_code: "myerp@visiontechbs.com"
					emp_code: emp_code
				},
				callback: function (data) {
					if (data.message == 0) {
						alert("There is no data for the seection");
					}
					else {
						$.each(data.message, function (i, d) {
							// var row = frappe.model.add_child(cur_frm.doc, "Child Table Doctype Name(as you add in option in Doctype B)", "child_table_field_name_in_doctype B");
							var child = frappe.model.add_child(frm.doc, "Reimbursement Table", "reimbursement_table");
							child.reqst_no = d[0];
							child.req_date = d[10];
							child.amount = d[13];
							child.type_of_request = d[11];
							child.reason_for_request = d[12];
							child.request_by = d[15];
							child.cost_centre = d[16];

							// refresh_field("child_table_field_name_in_doctype B");
							frm.refresh_field("reimbursement_table");

							// disable some rows
							var loadRecods = frm.doc.reimbursement_table;
							loadRecods.forEach(function (e) {
								if (e.amount == 250) {
									$("[data-idx='" + e.idx + "']").css('pointer-events', 'none');
									$("[data-idx='" + e.idx + "']").css('background', 'gray')
								}
							})
						});
					}
				}
			});
		} else if (!start_date && emp_code) {
			start_date = "";

			frappe.call({
				method: "petty_cash.petty_cash.doctype.reimbursement_form.reimbursement_form.petty_cash_req2",
				args: {
					emp_code: emp_code
				},
				callback: function (data) {
					if (data.message == 0) {
						alert("There is no data for the seection");
					}
					else {
						$.each(data.message, function (i, d) {
							var child = frappe.model.add_child(frm.doc, "Reimbursement Table", "reimbursement_table");
							child.reqst_no = d[0];
							child.req_date = d[10];
							child.amount = d[13];
							child.type_of_request = d[11];
							child.reason_for_request = d[12];
							child.request_by = d[15];
							child.cost_centre = d[16];

							frm.refresh_field("reimbursement_table");

							// disable some rows
							var loadRecods = frm.doc.reimbursement_table;
							loadRecods.forEach(function (e) {
								if (e.amount == 250) {
									$("[data-idx='" + e.idx + "']").css('pointer-events', 'none');
									$("[data-idx='" + e.idx + "']").css('background', 'gray')
								}
							})
						});
					}
				}
			});
		} else if (start_date && !emp_code) {
			frappe.call({
				method: "petty_cash.petty_cash.doctype.reimbursement_form.reimbursement_form.petty_cash_req3",
				args: {
					start_date: start_date
				},
				callback: function (data) {
					if (data.message == 0) {
						alert("There is no data for the seection");
					}
					else {
						$.each(data.message, function (i, d) {
							var child = frappe.model.add_child(frm.doc, "Reimbursement Table", "reimbursement_table");
							child.reqst_no = d[0];
							child.req_date = d[10];
							child.amount = d[13];
							child.type_of_request = d[11];
							child.reason_for_request = d[12];
							child.request_by = d[15];
							child.cost_centre = d[16];

							frm.refresh_field("reimbursement_table");

							// disable some rows
							var loadRecods = frm.doc.reimbursement_table;
							loadRecods.forEach(function (e) {
								if (e.amount == 250) {
									$("[data-idx='" + e.idx + "']").css('pointer-events', 'none');
									$("[data-idx='" + e.idx + "']").css('background', 'gray')
								}
							})
						});
					}
				}
			});
		} else {
			frappe.call({
				method: "petty_cash.petty_cash.doctype.reimbursement_form.reimbursement_form.petty_cash_req4",
				callback: function (data) {
					if (data.message == 0) {
						alert("There is no data for the seection");
					}
					else {
						
						console.log(data.message);
						$.each(data.message, function (i, d) {
							var child = frappe.model.add_child(frm.doc, "Reimbursement Table", "reimbursement_table");
							child.reqst_no = d[0];
							child.req_date = d[10];
							child.amount = d[13];
							child.type_of_request = d[11];
							child.reason_for_request = d[12];
							child.request_by = d[15];
							child.cost_centre = d[16];

							frm.refresh_field("reimbursement_table");

							// disable some rows
							var loadRecods = frm.doc.reimbursement_table;
							loadRecods.forEach(function (e) {
								if (e.amount == 250) {
									$("[data-idx='" + e.idx + "']").css('pointer-events', 'none');
									$("[data-idx='" + e.idx + "']").css('background', 'gray')
								}
							})
						});
					}
				}
			});
		}
	}

});

frappe.ui.form.on('Reimbursement Table', {

	// reimbursement_table_add: function (frm, cdt, cdn) {
	// 	// console.log("clicked13");
	// },

	// send_for_claim: function (frm, cdt, cdn) {
	// 	var d = locals[cdt][cdn]
	// 	console.log(d);
	// },

	onload: function (frm, cdt, cdn) {
		var selected_rows = [];
		console.log("clicked13");
		$('.dt-scrollable').find(":input[type=checkbox]").each((idx, row) => {
			if (row.checked) {
				selected_rows.push(frappe.query_report.data[idx]);
			}
		});
	},

	// refresh: function (frm, cdt, cdn) {
	// 	console.log("refersh");

	// }

});

function formatDate(date) {
	var d = new Date(date),
		year = d.getFullYear().toString(),
		month = (d.getMonth() + 101).toString().substring(1),
		day = (d.getDate() + 100).toString().substring(1);

	var formatted_date = year + "-" + month + "-" + day;
	return formatted_date;

}



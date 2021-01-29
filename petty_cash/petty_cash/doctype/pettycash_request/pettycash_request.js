// Copyright (c) 2021, Admin and contributors
// For license information, please see license.txt

frappe.ui.form.on('PettyCash Request', {
	onload: function(frm) {
		frm.set_df_property("request_date","read_only",1);
		frm.set_df_property("emply_code","read_only",1);
		frm.set_df_property("request_by","read_only",1);
		

		frm.doc.emply_code = frappe.session.user_email;
		frm.doc.request_by = frappe.session.user_fullname;

		
	}
});

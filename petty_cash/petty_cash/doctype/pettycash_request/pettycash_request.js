// Copyright (c) 2021, Admin and contributors
// For license information, please see license.txt

frappe.ui.form.on('PettyCash Request', {
	onload: function(frm) {
		frm.set_df_property("request_date","read_only",1);
		frm.set_df_property("emply_code","read_only",1);
		frm.set_df_property("request_by","read_only",1);
		

		frm.doc.emply_code = frappe.session.user_email;
		frm.doc.request_by = frappe.session.user_fullname;

		if (frm.doc.__islocal == 1) {
			frm.set_df_property("cancled_rqst","read_only",1);
			frm.set_df_property("cancelled_reason","read_only",1);
			frm.set_df_property("cancle_date","read_only",1);
			frm.set_df_property("cansellation_details_section","read_only",1);
			
		}
		if (!frm.doc.__islocal == 1) {
			if(!frm.doc.cancled_rqst){
				frm.set_df_property("cancelled_reason","read_only",1);
				frm.set_df_property("cancle_date","read_only",1);
				frm.set_df_property("cansellation_details_section","read_only",1);
			}
			// after department approval,petty cash cannot cancle
				if(frm.doc.department_approval){
				   frm.set_df_property("cancled_rqst","read_only",1);
				   frm.set_df_property("cansellation_details_section","read_only",1);
				}
		}
		
	},
	
});
frappe.ui.form.on("PettyCash Request", "cancled_rqst", function(frm, cdt, cdn){
    if(frm.doc.cancled_rqst == 1){
		frm.set_df_property("cancelled_reason", "read_only",0);
		frm.set_df_property("cancle_date", "read_only",0);
		frm.set_value("cancle_date" ,frappe.datetime.nowdate());
		frm.refresh_field("cancelled_reason");
		frm.refresh_field("cancle_date");
    }else{
		frm.set_value("cancelled_reason", "");
		frm.set_value("cancle_date", "");
		frm.set_df_property("cancelled_reason", "read_only",1);
		frm.set_df_property("cancle_date", "read_only",1);
		frm.refresh_field("cancelled_reason");
		frm.refresh_field("cancle_date");
	}
});

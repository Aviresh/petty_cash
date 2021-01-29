# -*- coding: utf-8 -*-
# Copyright (c) 2021, Admin and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from datetime import datetime
import json


class ReimbursementForm(Document):
    def test():
            pass

def check_petty_cash_req_empty(subject):
		subject_empty = bool(subject)
		if(subject_empty):
			return subject 
		else:
			subject = 0
			return subject

def create_journel_entry():
    	pass

@frappe.whitelist()
def petty_cash_req(start_date, emp_code):
		# subject = frappe.db.get_value(frappe.db.sql("""UPDATE `tabtesto` SET `Finished_Goods__I` = '{qty}' WHERE `item_name` LIKE '%{item_code}%'""".format(qty=rt["actual_qty"], item_name=rt["item_code"]), as_list=True))
		subject = frappe.db.sql("""Select * from `tabPettyCash Request` b where b.request_date = %s and b.emply_code = %s and b.department_approval = %s""", (start_date , emp_code,0))
		subject = check_petty_cash_req_empty(subject)
		return subject
	

@frappe.whitelist()
def petty_cash_req2(emp_code):
		subject = frappe.db.sql("""Select * from `tabPettyCash Request` b where b.emply_code = %s and b.department_approval = %s""", (emp_code,0))
		subject = check_petty_cash_req_empty(subject)
		return subject

@frappe.whitelist()
def petty_cash_req3(start_date):
		subject = frappe.db.sql("""Select * from `tabPettyCash Request` b where b.request_date = %s and b.department_approval = %s""", (start_date,0) )
		subject = check_petty_cash_req_empty(subject)
		return subject

@frappe.whitelist()
def petty_cash_req4():
		subject = frappe.db.sql("""Select * from `tabPettyCash Request` b where b.department_approval = %s""",0)
		subject = check_petty_cash_req_empty(subject)
		return subject

@frappe.whitelist()
def petty_cash_update(approved,pettycash_id,dep_app_by,dep_date):
		try:
			subject = frappe.db.sql("""UPDATE `tabPettyCash Request` b SET b.department_approval_by = %s, b.department_approval = %s, b.dep_date = %s  WHERE b.name  = %s """,(dep_app_by, approved, dep_date, pettycash_id))
			frappe.msgprint(('Petty Cash Request {} successfully Updated').format(pettycash_id))
		except:
			frappe.msgprint(('Petty Cash Request {} not successfully Updated').format(pettycash_id))

@frappe.whitelist()
def petty_cash_update2(approved,pettycash_id,fin_app_by,fin_date,reimburse_by,reimbursement_date,reimbursement_no):
		try:
			subject = frappe.db.sql("""UPDATE `tabPettyCash Request` b SET b.finance_approval_by = %s, b.fin_approval = %s, b.fin_date = %s, b.reimburse_by = %s, b.reimbursement_date = %s, b.reimbursement_no = %s  WHERE b.name  = %s """,(fin_app_by, approved, fin_date, reimburse_by, reimbursement_date, reimbursement_no, pettycash_id))
			frappe.msgprint(('Petty Cash Request {} successfully Updated').format(pettycash_id))
			return
		except:
			frappe.msgprint(('Petty Cash Request {} not successfully Updated').format(pettycash_id))
			return

 

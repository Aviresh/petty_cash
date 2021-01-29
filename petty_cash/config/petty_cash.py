from __future__ import unicode_literals
from frappe import _

def get_data():
    	return [
		{
			"label": _("Petty Cash Request"),
			"icon": "fa fa-group",
			"items": [
				{
					"type": "doctype",
					"name": "petty_cash_request",
					"description": _("System and Website Users")
				}
            ]
        }
            ]
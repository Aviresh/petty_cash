# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "petty_cash"
app_title = "Petty Cash"
app_publisher = "Admin"
app_description = "Petty cash"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "Aviresh1995@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/petty_cash/css/petty_cash.css"
# app_include_js = "/assets/petty_cash/js/petty_cash.js"

# include js, css files in header of web template
# web_include_css = "/assets/petty_cash/css/petty_cash.css"
# web_include_js = "/assets/petty_cash/js/petty_cash.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "petty_cash.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "petty_cash.install.before_install"
# after_install = "petty_cash.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "petty_cash.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"Petty Cash Request": {
# 		"on_update": "get_full1_name",
# 		"on_submit": "get_full1_name"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"petty_cash.tasks.all"
# 	],
# 	"daily": [
# 		"petty_cash.tasks.daily"
# 	],
# 	"hourly": [
# 		"petty_cash.tasks.hourly"
# 	],
# 	"weekly": [
# 		"petty_cash.tasks.weekly"
# 	]
# 	"monthly": [
# 		"petty_cash.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "petty_cash.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "petty_cash.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "petty_cash.task.get_dashboard_data"
# }


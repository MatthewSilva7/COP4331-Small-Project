# COP4331-Small-Project

Repository for POOSD small project.

## Project setup

- **GitHub:** https://github.com/MatthewSilva7/COP4331-Small-Project.git  
- **Live site:** http://msilvacop4331/smallproj/

### Database credentials (for `db_connect.php`)

| Setting | Value |
|--------|--------|
| Host   | `localhost` |
| Database | `smallproj` |
| User   | `smallproj_user` |
| Password | `smallproj_pass` |

These are already set in `db_connect.php`. Do not re-type them in every API file.

### Local testing (before pushing)

Install a local LAMP stack so you can run PHP and MySQL on your machine:

- **Windows:** [XAMPP](https://www.apachefriends.org/)  
  - Puts your site in `C:\xampp\htdocs\`.  
  - Put this project folder inside `htdocs` (e.g. `htdocs/smallproj/`).  
  - Start Apache and MySQL in the XAMPP Control Panel, then open `http://localhost/smallproj/` in your browser.

- **Mac:** [MAMP](https://www.mamp.info/) (or XAMPP for Mac)  
  - MAMP uses `/Applications/MAMP/htdocs/`.  
  - Put this project folder inside `htdocs` (e.g. `htdocs/smallproj/`).  
  - Start MAMP (Start Servers), then open `http://localhost:8888/smallproj/` (or the port MAMP shows).

**Rule:** Test your PHP/API changes locally before pushing to GitHub.

### Roles

- **Database:** Maintain `schema.sql` (table definitions). Someone runs it on the server to create/update tables.
- **API:** Use `db_connect.php` for DB access; do not duplicate credentials in each file.
- **Everyone:** Use XAMPP (Windows) or MAMP (Mac) to test locally.
//test
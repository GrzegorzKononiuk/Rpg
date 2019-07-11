<?php
namespace Rpg\MonsterAPI;
use \PDO;
/** 
 * Database.php
 * DatabaseObject to handle managing database connection and queries
 */
 
class jsonData
{
	// Properties
	private $dbhost = 'localhost';
	private $dbuser = 'root';
	private $dbpass = '';
	private $dbname = 'rpg';

	// Connect
	public function connect()
	{
			$mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname";
			$dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
			$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $dbConnection;
	}
}
 


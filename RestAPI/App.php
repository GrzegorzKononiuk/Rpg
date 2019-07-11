<?php
namespace Rpg\MonsterAPI;
use \PDO;
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

class App
{
	
private $app;
    
	public function __construct()
	{	
	
		$app = new \Slim\App;
		
		//Get monsters
		$app->get('/api/monsters/{id}', function (Request $request, Response $response) 
		{
			$id = $request->getAttribute('id');
			$sql = "SELECT * FROM monsters WHERE id = $id";

			try
			{
				// Get DB Object
				$db = new jsonData();
				// Connect
				$db = $db->connect();
				
				$stmt = $db->query($sql);
				$monsters = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
				$db = null;
				
				return json_encode($monsters);
			} 
			catch(PDOException $e)
			{
				echo '{"error": {"text": '.$e->getMessage().'}';
			}
		});
		
		$this->app = $app;
        
		//Get User Stats
		$app->get('/api/users/{id}', function(Request $request, Response $response)
		{
			$id = $request->getAttribute('id');
			$sql = "SELECT username,exp,health,strength FROM users WHERE id = $id";

			try
			{
				// Get DB Object
				$db = new jsonData();
				// Connect
				$db = $db->connect();
				
				$stmt = $db->query($sql);
				$monsters = $stmt->fetchALL(PDO::FETCH_ASSOC);
				
				$db = null;
				
				return json_encode($monsters);
			} 
			catch(PDOException $e)
			{
				echo '{"error": {"text": '.$e->getMessage().'}';
			}
		});
		
		$this->app = $app;
	
	
		// Update User Stats
		$app->put('/api/users/update/{id}', function(Request $request, Response $response)
		{
			
			$id = $request->getAttribute('id');
			$exp = $request->getParam('exp');

			$sql = "UPDATE users SET
					exp 	= :exp
				WHERE id = $id";

			try
			{
				// Get DB Object
				$db = new jsonData();
				// Connect
				$db = $db->connect();
				
				$stmt = $db->prepare($sql);

				
				$stmt->bindParam(':exp', $exp);
				
				$stmt->execute();

				echo '{"notice": {"text": "Customer Updated!!!!"}';

			} 
			catch(PDOException $e)
			{
				echo '{"error": {"text": '.$e->getMessage().'}';
			}
		});
		
			$this->app = $app;
		
	}
	
	
	public function get()
    {
        return $this->app;
    }
	
	public function put()
    {
        return $this->app;
    }
}

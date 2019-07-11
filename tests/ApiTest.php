<?php
use PHPUnit\Framework\TestCase;
use Rpg\MonsterAPI\App;
use Slim\Http\Environment;
use Slim\Http\Request;

class ApiTest extends TestCase
{
    protected $app;
    
	public function setUp()
    {
        $this->app = (new App())->get();
    }
    public function testTodoGet() 
	{
		
        $env = Environment::mock
			([
				'REQUEST_METHOD' => 'GET',
				'REQUEST_URI'    => '/api/users/111',
            ]);
        $req = Request::createFromEnvironment($env);
        $this->app->getContainer()['request'] = $req;
        $response = $this->app->run(true);
        $this->assertSame($response->getStatusCode(), 200);
		
		$data = json_decode($response->getBody(), true);
		$this->assertArrayHasKey('id', $data);
    }
   
}
?>
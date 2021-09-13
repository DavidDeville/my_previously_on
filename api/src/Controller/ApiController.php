<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController
{
    private $client;

    public function __construct()
    {
        $this->client = HttpClient::create();
    }

    /**
     * Function to get the code used in the login process
     *
     * @param object $request
     *
     * @return string - the code obtained during the first part of
     * the identification process
     */
    public function getCode(Request $request)
    {
        return $request->query->get('code');
    }

    /**
     * Function to convert a json to an array
     * 
     * @param object $request
     * 
     * @return array $parametersAsArray - the parameters as array
     */
    public function jsonToArray(Request $request)
    {
        $parametersAsArray = [];
        if ($content = $request->getContent()) {
            $parametersAsArray = json_decode($content, true);
        }
        return $parametersAsArray;
    }

    /**
     * @Route("/login", methods={"POST"}, name="show_login")
     * 
     * @param request - object request injected by Symfony
     * 
     * @return object $userData - object that contains user's information such
     * as its token, id, nickname, hashed password, xp etc
     */
    public function getLoginForm(Request $request)
    {
        /**
         * If user is trying to log in, a request is made to get its access token
         */
        $request = $this->jsonToArray($request);
        if (!empty($request['nickName']) && !empty($request['password'])) {
            $response = $this->client->request('POST', "https://api.betaseries.com/members/auth?key=c499f6741abe", [
                'query' => [
                    'login' => $request['nickName'],
                    'password' => md5($request['password']),
                ],
            ]);
            $content = $response->getContent();
            $content = json_decode($content);

            $userData = $this->json($content);

            return $userData;
        }

        /**
         * If user is logged in, a request is made to get its access token
         */
        // if(!empty($code)) {
        //     $response = $this->client->request('POST', "https://api.betaseries.com/oauth/access_token", [
        //         'query' => [
        //             'client_id' => "c499f6741abe",
        //             'client_secret' => 'a47f1b6fc20c99860363a29d3d6d641c',
        //             'redirect_uri' => 'http://127.0.0.1:8000/login/',
        //             'code' => $code
        //             ]
        //         ]);
        // }

        // $statusCode = $response->getStatusCode();

        // $content = $response->getContent();
        // $content = json_decode($content);
        //dd($content->access_token);

        //$getEmail = $this->client->request('GET', 'https://api.betaseries.com/members/email?key=c499f6741abe&access_token='.$content->access_token);

        //var_dump($getEmail->getContent());
        // $favShows = $this->getUserFavShows($request, $content);

        // dd($favShows->shows[0]->original_title);

        //return new Response ($content);
    }

    /**
     * @Route ("/shows/search", methods={"POST"}, name="shows_search")
     */
    public function getSearchedShows(Request $request) {
        $reqShow = json_decode($request->getContent());
        $requestedShows = $this->client->request('GET', "https://api.betaseries.com/search/all?key=c499f6741abe&query=".$reqShow->submittedShow);
        $requestedShows = $requestedShows->getContent();
        $shows = json_decode($requestedShows);
        return($this->json($shows));
    }

    public function getUserFavShows(Request $request, $content)
    {
        $memberFavShow = $this->client->request('GET', 'https://api.betaseries.com/shows/favorites?key=c499f6741abe&access_token=' . $content->access_token);
        $showsList = $memberFavShow->getContent();
        $showsList = json_decode($showsList);
        return $showsList;
    }

    /**
     * Function to get the shows a user added to his list
     * 
     * @param object $request
     * 
     * @return object userShows (contains all the user shows) and page (used to handle the pagination)
     * 
     * @Route ("/user/shows", methods={"POST"}, name="user_shows")
     */
    public function getUserShows(Request $request) 
    {
        $req = json_decode($request->getContent());
        $page = $this->getUserShowsPages($req->token);
        $userSelectedShows = $this->client->request('GET', "https://api.betaseries.com/shows/member?key=c499f6741abe&limit=10&offset=" . $req->offset . "&access_token=".$req->token);
        $userSelectedShows = $userSelectedShows->getContent();
        $userShows = json_decode($userSelectedShows);
        return $this->json(["userShows"=> $userShows, "userShowsCount"=> $page ]);
    }

    /**
     * Function to handle whenever the user wants to add a new show
     * to his list
     * 
     * @param object $request
     * 
     * @return object $data - all the data related to the API request
     * 
     * @Route ("/show/add", methods={"POST"}, name="show_add")
     */
    public function addShow(Request $request) {
        $data = json_decode($request->getContent());
        $showAddedByUser = $this->client->request('POST', "https://api.betaseries.com/shows/show?key=c499f6741abe&id=".$data->showId."&access_token=".$data->userToken);
        return($this->json($data));
    }

    /**
     * Function to get the number of shows that a user added
     * 
     * @param object $token - logged user's token
     * 
     * @return int $userShowsCount - number of shows
     */
    public function getUserShowsPages($userToken)
    {
        $numberOfPages = $this->client->request('GET', "https://api.betaseries.com/shows/member?key=c499f6741abe&access_token=".$userToken);
        $numberOfPages = $numberOfPages->getContent();
        $pagesCount = json_decode($numberOfPages);
        $pagesCount = count($pagesCount->shows);
        return ($pagesCount);
    }

    /**
     * Function to archive a show selected by the user
     *
     * @param object $request
     * 
     * @Route ("show/archive", methods={"POST"}, name="show_archive")
     */
    public function archiveUserShow(Request $request) 
    {
        $data = json_decode($request->getContent());
        $showToArchive = $this->client->request('POST', "https://api.betaseries.com/shows/archive?id=".$data->showId."&access_token=".$data->token."&key=c499f6741abe");
        $showToArchive = $showToArchive->getContent();
        $archivedShow = json_decode($showToArchive);
        return $this->json($archivedShow);
    }

    /**
     * Function to archive a show selected by the user
     *
     * @param object $request
     * 
     * @Route ("show/unarchive", methods={"POST"}, name="show_unarchive")
     */
    public function unarchiveUserShow(Request $request) 
    {
        $data = json_decode($request->getContent());
        $showTounArchive = $this->client->request('DELETE', "https://api.betaseries.com/shows/archive?id=".$data->showId."&access_token=".$data->token."&key=c499f6741abe");
        $showTounArchive = $showTounArchive->getContent();
        $unarchivedShow = json_decode($showTounArchive);
        return $this->json($unarchivedShow);
    }
}

/*
 * This file stores the current gameplay information.
 * Access this data anywhere using 
 * MainGame.Instance()     (e.g. Global.Instance().CurrentLevel) 
 */
enum GameAction { 
    IncreaseValve1, IncreaseValve2, IncreaseValve3, 
    IncreasePump1, IncreasePump2, IncreasePump3  
}

/* Some Styles */
var labelStyle:GUIStyle;

/* Current highscore within the Gameplay */
var Money:int = 0;
/* The current level we are playing (0-9, 10 -> Game is finished) */
var CurrentLevel:int = 0; 

/* The current gamespeed (update interval in seconds) */
var GameSpeed:int = 3;

/* The current power amount generated by the power plants (unit: MwH) */
var PowerGeneration:int = 100; 
/* The current power amount needed by the households (unit: MwH) */
var PowerDemand:int = -100; 

/* The amount of power currently generated by kops */
var KopsPowerGeneration:int = 0;
/* The amount of power currently consumed by kops */
var KopsPowerConsumption:int = 0;

/* whether to show the game menu */
var ShowGameMenu = true;

private var _nextUpdate:float=0;

private var _leftLabelStyle:GUIStyle;
private var _rightLabelStyle:GUIStyle;

private var _valve1Percentage:float = 0.5;
private var _valve2Percentage:float = 0.5;
private var _valve3Percentage:float = 0.5;

function Start () {
    _leftLabelStyle = new GUIStyle(labelStyle);
    _leftLabelStyle.alignment = TextAnchor.MiddleLeft;
    _rightLabelStyle = new GUIStyle(labelStyle);
    _rightLabelStyle.alignment = TextAnchor.MiddleRight;
}

/* Main Game processing Loop */
function Update () {
	if(Time.time > _nextUpdate) {
        
        Debug.Log("All Game Values are being updated now");

        _nextUpdate = Time.time + GameSpeed;
    }
}

function OnGUI() {
    var screenThird = Screen.width * 0.33;
    var labelHeight = 25;
    var topPadding = 10;
    var sidePadding = 25;

    // PowerPlant Generation -> Top Left
    GUI.Label(Rect(sidePadding,topPadding, screenThird, labelHeight), FormatNumber(PowerGeneration), _leftLabelStyle);

    // Household Consumption -> Top Right
    GUI.Label(Rect(Screen.width - sidePadding - screenThird,topPadding, screenThird, labelHeight), FormatNumber(PowerDemand), _rightLabelStyle);

    // some logging
    GUI.Label(Rect(sidePadding,Screen.height - (3 * labelHeight), screenThird, labelHeight), String.Format("{0:0%} Valve / {1:0%} Pump", _valve1Percentage, 1-_valve1Percentage), _leftLabelStyle);
    GUI.Label(Rect(sidePadding,Screen.height - (2 * labelHeight), screenThird, labelHeight), String.Format("{0:0%} Valve / {1:0%} Pump", _valve2Percentage, 1-_valve2Percentage), _leftLabelStyle);
    GUI.Label(Rect(sidePadding,Screen.height - (1 * labelHeight), screenThird, labelHeight), String.Format("{0:0%} Valve / {1:0%} Pump", _valve3Percentage, 1-_valve3Percentage), _leftLabelStyle);
}

function FormatNumber(number:int) {
    if(number < 0) {
        return number + " MwH";
    }
    else {
        return "+" + number + " MwH";
    }
}
/*---------------------------------
 * Some Additional Game API
 *-------------------------------*/ 

static function Instance() {
    var mainCameras = GameObject.FindGameObjectsWithTag("MainCamera");
    if(mainCameras == null || mainCameras.length == 0) {
        return null;
    }

    var mainGame:MainGame = mainCameras[0].GetComponent(MainGame);
    return mainGame;
}

function CompleteLevel() {
    CurrentLevel++;
    if(CurrentLevel == 10) {
        Debug.Log("Yeay, we game is finished, let's restart!");
        CurrentLevel = 0;
    }
}

function InvokeGameAction(action:GameAction, param:float) {
    Debug.Log(Time.time + " - Yeay! Interaction: " + action + "(" + param + ")");
    switch (action) {
        case GameAction.IncreaseValve1: 
            _valve1Percentage = Mathf.Min(1, _valve1Percentage + param);
        break;
        case GameAction.IncreaseValve2: 
            _valve2Percentage = Mathf.Min(1, _valve2Percentage + param);
        break;
        case GameAction.IncreaseValve3: 
            _valve3Percentage = Mathf.Min(1, _valve3Percentage + param);
        break;
        case GameAction.IncreasePump1: 
            _valve1Percentage = Mathf.Max(0, _valve1Percentage - param);
        break;
        case GameAction.IncreasePump2:
            _valve2Percentage = Mathf.Max(0, _valve2Percentage - param);
        break;
        case GameAction.IncreasePump3:
            _valve3Percentage = Mathf.Max(0, _valve3Percentage - param);
        break; 
    }
}
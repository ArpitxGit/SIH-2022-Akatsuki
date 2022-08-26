//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//smart contract is an object to store data on blockchain

/*
* @title QualityAssurance 
* @author TeamAkatsuki
* @aim to enable trust on the quality of farm produce and assurance on raw material quality
*/

contract QualityAssurance {

//events
    event createdCrop(string cropName, string cropType, uint256 minMoisture,uint256 maxMoisture, uint256 minTemperature, uint256 maxTemperature, uint256 harvestTime);
    event createdFarm(string farmType, uint256 minMoisture,uint256 maxMoisture, uint256 minTemperature, uint256 maxTemperature, uint256 harvestTime);

//struct for crop related data
    struct Crop{
        string cropName;
        string cropType;
        uint256 minMoisture;
        uint256 maxMoisture;
        uint256 minTemperature;
        uint256 maxTemperature;
        uint256 harvestTime;
    }
//struct for farm related data
    struct Farmland{
        string farmType;
        uint256 minMoisture;
        uint256 minTemperature;
        uint256 maxMoisture;
        uint256 maxTemperature;
        uint256 harvestTime;
    }
//creating array of our structs
    Crop[] public crops;
    Farmland[] public farms;

//function that gets executed while creating/departure of new crop and emits the createdcrop event
    function createCrop(string calldata _cropName, string calldata _cropType, uint256 _minMoisture,uint256 _maxMoisture, uint256 _minTemperature, uint256 _maxTemperature) public {
        Crop memory crop;
        crop.cropName = _cropName;
        crop.cropType = _cropType;
        crop.minMoisture = _minMoisture;
        crop.minTemperature = _minTemperature;
        crop.maxMoisture = _maxMoisture;
        crop.maxTemperature = _maxTemperature;
        crop.harvestTime = block.timestamp;
        crops.push(crop);
        emit createdCrop(_cropName, _cropType, _minMoisture, _maxMoisture, _minTemperature, _maxTemperature, crop.harvestTime);
    }
//function that gets executed while creating a new and emits the createdFarm event
    function createFarm(string calldata _farmType, uint256 _minMoisture,uint256 _maxMoisture, uint256 _minTemperature, uint256 _maxTemperature) public {
        Farmland memory farm;
        farm.farmType = _farmType;
        farm.minMoisture = _minMoisture;
        farm.minTemperature = _minTemperature;
        farm.maxMoisture = _maxMoisture;
        farm.maxTemperature = _maxTemperature;
        farm.harvestTime = block.timestamp;
        farms.push(farm);
        emit createdFarm(_farmType, _minMoisture, _maxMoisture, _minTemperature, _maxTemperature, farm.harvestTime);
    }

}

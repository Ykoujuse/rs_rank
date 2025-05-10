local QBCore = nil
local ESX = nil
local isRankOpen = false

if Config.Framework == 'esx' then
    ESX = exports['es_extended']:getSharedObject()
elseif Config.Framework == 'qbcore' then
    QBCore = exports['qb-core']:GetCoreObject()
end

CreateThread(function()
    RegisterCommand(Config.CommandName, function()
        if not isRankOpen then
            OpenWealthRank()
        else
            CloseWealthRank()
        end
    end, false)
end)

function OpenWealthRank()
    isRankOpen = true
    
    if Config.Framework == 'esx' then
        ESX.TriggerServerCallback('rs_rank:getLeaderboard', function(leaderboard)
            SetNuiFocus(true, true)
            SendNUIMessage({
                type = 'open_rank',
                leaderboard = leaderboard,
                config = Config
            })
        end)
    else
        QBCore.Functions.TriggerCallback('rs_rank:getLeaderboard', function(leaderboard)
            SetNuiFocus(true, true)
            SendNUIMessage({
                type = 'open_rank',
                leaderboard = leaderboard,
                config = Config
            })
        end)
    end
end

function CloseWealthRank()
    isRankOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = 'close_rank'
    })
end

RegisterNUICallback('close', function(data, cb)
    CloseWealthRank()
    cb('ok')
end)

RegisterNUICallback('refresh', function(data, cb)
    if Config.Framework == 'esx' then
        ESX.TriggerServerCallback('rs_rank:getLeaderboard', function(leaderboard)
            SendNUIMessage({
                type = 'refresh_data',
                leaderboard = leaderboard
            })
            cb('ok')
        end)
    else
        QBCore.Functions.TriggerCallback('rs_rank:getLeaderboard', function(leaderboard)
            SendNUIMessage({
                type = 'refresh_data',
                leaderboard = leaderboard
            })
            cb('ok')
        end)
    end
end)

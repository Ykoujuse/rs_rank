local QBCore = nil
local ESX = nil

if Config.Framework == 'esx' then
    ESX = exports['es_extended']:getSharedObject()
elseif Config.Framework == 'qbcore' then
    QBCore = exports['qb-core']:GetCoreObject()
else
    print('[RS-排行榜] 未识别到次框架 ' .. Config.Framework)
end

local function GetOnlinePlayersWealth()
    local players = {}
    
    if Config.Framework == 'esx' then
        local xPlayers = ESX.GetPlayers()
        for i=1, #xPlayers do
            local xPlayer = ESX.GetPlayerFromId(xPlayers[i])
            if xPlayer then
                local playerMoney = xPlayer.getMoney() or 0
                local playerBank = xPlayer.getAccount('bank').money or 0
                local totalWealth = playerMoney + playerBank
                
                table.insert(players, {
                    name = xPlayer.getName() or ('Player_' .. xPlayer.source),
                    wealth = totalWealth,
                    cash = playerMoney,
                    bank = playerBank,
                    rank = 0 
                })
            end
        end
    elseif Config.Framework == 'qbcore' then
        local qbPlayers = QBCore.Functions.GetPlayers()
        for i=1, #qbPlayers do
            local Player = QBCore.Functions.GetPlayer(tonumber(qbPlayers[i]))
            if Player then
                local playerMoney = Player.PlayerData.money['cash'] or 0
                local playerBank = Player.PlayerData.money['bank'] or 0
                local totalWealth = playerMoney + playerBank
                
                table.insert(players, {
                    name = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname,
                    wealth = totalWealth,
                    cash = playerMoney,
                    bank = playerBank,
                    rank = 0
                })
            end
        end
    end

    table.sort(players, function(a, b)
        return a.wealth > b.wealth
    end)

    for i=1, #players do
        players[i].rank = i
    end

    local topPlayers = {}
    for i=1, math.min(Config.MaxPlayersToShow, #players) do
        table.insert(topPlayers, players[i])
    end
    
    return topPlayers
end

if Config.Framework == 'esx' then
    ESX.RegisterServerCallback('rs_rank:getLeaderboard', function(source, cb)
        cb(GetOnlinePlayersWealth())
    end)
else
    QBCore.Functions.CreateCallback('rs_rank:getLeaderboard', function(source, cb)
        cb(GetOnlinePlayersWealth())
    end)
end


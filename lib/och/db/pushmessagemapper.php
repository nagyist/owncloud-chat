<?php
/**
 * Copyright (c) 2014, Tobia De Koninck hey--at--ledfan.be
 * This file is licensed under the AGPL version 3 or later.
 * See the COPYING file.
 */

namespace OCA\Chat\OCH\Db;

use \OCP\AppFramework\Db\Mapper;
use \OCP\IDb;
use \OCA\Chat\Db\DoesNotExistException;
use \OCA\Chat\OCH\Db\UserOnlineMapper;

class PushMessageMapper extends Mapper {

	private $USER_ONLINE = '*PREFIX*chat_och_users_online';
	private $USERS_IN_CONV = '*PREFIX*chat_och_users_in_conversation';

	private $userOnlineMapper;
	private $userMapper;

	public function __construct(IDb $api, UserOnlineMapper $userOnlineMapper, UserMapper $userMapper) {
		parent::__construct($api, 'chat_och_push_messages'); // tablename is news_feeds
		$this->userOnlineMapper = $userOnlineMapper;
		$this->userMapper = $userMapper;
	}

	public function findBysSessionId($sessionId){
		$sql = 'SELECT * FROM `' . $this->getTableName() . '` ' . 'WHERE `receiver_session_id` = ?';
		$feeds =  $this->findEntities($sql, array($sessionId));
		if (count($feeds) === 0 ){
			throw new DoesNotExistException('');
		} else {
			return $feeds;
		}
	}

	public function createForAllSessionsOfAUser($receiverId, $sender, $command){
		$receivers = $this->userOnlineMapper->findByUser($receiverId);
		foreach($receivers as $receiver){
			$pushMessage = new PushMessage();
			$pushMessage->setSender($sender);
			$pushMessage->setCommand($command);
			$pushMessage->setReceiver($receiver->getUser());
			$pushMessage->setReceiverSessionId($receiver->getSessionId());
			$this->insert($pushMessage);
		}
	}

	public function createForAllUsersInConv($sender, $convId, $command, $exception=null){
		$sessions = $this->userMapper->findSessionsByConversation($convId);
		foreach($sessions as $session){
			if($exception === $session->getUser()){
				continue;
			}
			$pushMessage = new PushMessage();
			$pushMessage->setSender($sender);
			$pushMessage->setCommand($command);
			$pushMessage->setReceiver($session->getUser());
			$pushMessage->setReceiverSessionId($session->getSessionId());
			$this->insert($pushMessage);
		}
	}

	public function createForAllSessions($sender, $command){
		$sessions = $this->userOnlineMapper->getAll();
		foreach($sessions as $session){
			$pushMessage = new PushMessage();
			$pushMessage->setSender($sender);
			$pushMessage->setCommand($command);
			$pushMessage->setReceiver($session->getUser());
			$pushMessage->setReceiverSessionId($session->getSessionId());
			$this->insert($pushMessage);
		}
	}

	public function findAll(){
		$sql = 'SELECT * FROM `' . $this->getTableName() . '`';
		return $this->findEntities($sql, array());
	}

}
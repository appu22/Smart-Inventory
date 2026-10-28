package com.smartinventory.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/smartinventory")
public class SmartInventoryController {
	
	
		@GetMapping("/home")
		public String home() {
			return "i am home..";
		}

}

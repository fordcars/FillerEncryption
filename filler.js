// Copyright Carl Hewett 2014

function encrypt(keycode, value)
{
	var output = "";
	var keycodeLength = keycode.length;
	var valueLength = value.length;
	
	var addFilling;
	var keycodeCharIndex = keycodeLength-1;
	var keycodeConstant = getKeycodeConstant(keycode);
	var valueFillingIndex;
	var valueFillingCharCode;
	var valueChar;
	
	var lastChar = false;
	
	for(var i=0; i<valueLength; i++)
	{
		addFilling = randomInt(-1, 2);
		valueChar = value[i];
		
		if(i==0)
		{
			var addFirstFilling = randomInt(-1, 2);
			
			if(addFirstFilling==0)
			{
				output += createFilling(value, keycode, keycodeConstant, keycodeCharIndex) + " ";
				
				keycodeCharIndex = loopValue(keycodeCharIndex, keycodeLength, true);
			}
		}
		
		if(i==valueLength-1)
		{
			output += encryptChar(valueChar, keycode[keycodeCharIndex], keycodeConstant);
			lastChar = true;
		} else
		{
			output += encryptChar(valueChar, keycode[keycodeCharIndex], keycodeConstant) + " ";
		}
		
		if(addFilling==0)
		{		
			keycodeCharIndex = loopValue(keycodeCharIndex, keycodeLength, true);
			
			if(lastChar)
			{
				output += " " + createFilling(value, keycode, keycodeConstant, keycodeCharIndex);
			} else
			{
				output += createFilling(value, keycode, keycodeConstant, keycodeCharIndex) + " ";
			}
		}
		
		keycodeCharIndex = loopValue(keycodeCharIndex, keycodeLength, true);
	}
	
	return output;
}

function encryptChar(charToEncrypt, keycodeChar, keycodeConstant, isFilling)
{
	if(isFilling)
	{
		return charToEncrypt * keycodeChar + keycodeConstant;
	}
	
	return charToEncrypt.charCodeAt(0) * keycodeChar.charCodeAt(0) + keycodeConstant;
}

function loopValue(value, valueLength, substraction)
{
	var output = value;
	
	if(substraction)
	{
		if(output<=0)
		{
			output = valueLength-1;
		} else
		{
			output--;
		}
	} else
	{
		if(output>=valueLength-1)
		{
			output = 0;
		} else
		{
			output++;
		}
	}
	
	return output;
}

function createFilling(value, keycode, keycodeConstant, keycodeCharIndex)
{
	var valueLength = value.length;
	var keycodeLength = keycode.length;
	var valueFillingIndex = randomInt(-1, valueLength);
	var valueFillingCharCode;

	if(value[valueFillingIndex]==keycode[keycodeCharIndex]) // Make sure the fake char is not the same as the "future" keycode char!
	{
		if(!valueFillingIndex==0) // If there is more than one char in value. If not, ignore, well make it work later.
		{
			valueFillingIndex = loopValue(valueFillingIndex, valueLength, false);
		}
	}

	if(value[valueFillingIndex]==keycode[keycodeCharIndex]) // Checks again
	{
		valueFillingCharCode = value[valueFillingIndex].charCodeAt(0) + 1;
	} else
	{
		valueFillingCharCode = value[valueFillingIndex].charCodeAt(0);
	}

	return encryptChar(valueFillingCharCode, keycode[keycodeCharIndex].charCodeAt(0) + 1, keycodeConstant, true);
}

function getKeycodeConstant(keycode)
{
	var keycodeConstant = 0;
	
	for(var i=0, length=keycode.length; i<length; i++)
	{
		keycodeConstant = keycodeConstant + keycode[i].charCodeAt(0) * keycode[i].charCodeAt(0);
	}
	
	return keycodeConstant;
}

function decrypt(keycode, value)
{
	var outputArray = [];
	var outputString = "";
	var keycodeLength = keycode.length;
	var valueLength = value.length;
	
	var keycodeCharIndex = keycodeLength-1;
	var keycodeConstant = getKeycodeConstant(keycode);
	var valueChar;
	
	var currentDecryptedWord;
	
	var currentWord = "";
	var currentWordIndex = -1;
	
	var lastWord = false;
	
	for(var i=0; i<valueLength; i++)
	{
		valueChar = value[i];
		
		if(i==valueLength-1) // If this is the last char
		{
			currentWord += valueChar; // Add it (normally done after the spaces in value).
			lastWord = true;
		}
		
		if(valueChar==" " || lastWord)
		{
			currentWordIndex++;
			
			currentWord = parseInt(currentWord);
			currentDecryptedWord = decryptWord(currentWord, keycode[keycodeCharIndex], keycodeConstant);
			
			if(isInt(currentDecryptedWord))
			{
				outputArray.push(currentDecryptedWord);
			}
			
			keycodeCharIndex = loopValue(keycodeCharIndex, keycodeLength, true);
			
			currentWord = "";
		} else
		{
			currentWord += valueChar;
		}
	}
	
	for(var i=0, length=outputArray.length; i<length; i++)
	{
		outputString += String.fromCharCode(outputArray[i]);
	}
	
	return outputString;
}

function decryptWord(wordToDecrypt, keycodeChar, keycodeConstant)
{
	return (wordToDecrypt - keycodeConstant) / keycodeChar.charCodeAt(0);
}

function isInt(n) // http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
{
    return n === +n && n === (n|0);
}

function randomInt(min, max) // Between min and max (exclusive)
{
	return Math.floor(Math.random()*(min-max+1)+max);
}